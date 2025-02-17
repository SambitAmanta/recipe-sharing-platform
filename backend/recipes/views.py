from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from elasticsearch_dsl import Q
from django_elasticsearch_dsl.search import Search
from .documents import RecipeDocument
from django.db.models import Avg
from django.db import models
from .models import Recipe, Category, Tag, Rating, Review, Comment, Collection
from .serializers import (RecipeSerializer, CategorySerializer, TagSerializer,
                          RatingSerializer, ReviewSerializer, CollectionSerializer, CommentSerializer, RecipeSearchSerializer)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class RecipeViewSet(viewsets.ModelViewSet):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'ingredients']
    ordering_fields = ['created_at', 'average_rating']

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=True, methods=['post'])
    def rate(self, request, pk=None):
        recipe = self.get_object()
        rating_value = request.data.get('rating')

        if not rating_value:
            return Response(
                {'error': 'Rating value is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        rating, created = Rating.objects.update_or_create(
            recipe=recipe,
            user=request.user,
            defaults={'value': rating_value}
        )

        return Response(RatingSerializer(rating).data)

    @action(detail=True, methods=['post'])
    def review(self, request, pk=None):
        recipe = self.get_object()
        serializer = ReviewSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(recipe=recipe, user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def vote_review(self, request, pk=None):
        recipe = self.get_object()
        review_id = request.data.get('review_id')
        vote_type = request.data.get('vote_type')

        try:
            review = Review.objects.get(id=review_id, recipe=recipe)
        except Review.DoesNotExist:
            return Response(
                {'error': 'Review not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        if vote_type == 'upvote':
            review.downvotes.remove(request.user)
            if request.user in review.upvotes.all():
                review.upvotes.remove(request.user)
            else:
                review.upvotes.add(request.user)
        elif vote_type == 'downvote':
            review.upvotes.remove(request.user)
            if request.user in review.downvotes.all():
                review.downvotes.remove(request.user)
            else:
                review.downvotes.add(request.user)

        return Response(ReviewSerializer(review).data)


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CollectionViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CollectionSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Collection.objects.filter(
                models.Q(user=self.request.user) |
                models.Q(is_public=True)
            )
        return Collection.objects.filter(is_public=True)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class RecipeSearchViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    def get_queryset(self):
        return RecipeDocument.search()

    @action(detail=False, methods=['get'])
    def search(self, request):
        # Get search parameters
        query = request.GET.get('q', '')
        category = request.GET.get('category')
        tags = request.GET.getlist('tags')
        difficulty = request.GET.get('difficulty')
        min_rating = request.GET.get('min_rating')
        max_time = request.GET.get('max_time')

        # Build search query
        search = self.get_queryset()

        if query:
            # Multi-match query across multiple fields
            search = search.query(
                'multi_match',
                query=query,
                fields=['title^3', 'description^2',
                        'ingredients^2', 'instructions'],
                fuzziness='AUTO'
            )

        # Apply filters
        if category:
            search = search.filter('term', category__id=category)

        if tags:
            search = search.filter('terms', tags__id=tags)

        if difficulty:
            search = search.filter('term', difficulty=difficulty)

        if min_rating:
            search = search.filter('range', average_rating={
                                   'gte': float(min_rating)})

        if max_time:
            search = search.filter('range', cooking_time={
                                   'lte': int(max_time)})

        # Execute search
        response = search.execute()

        # Serialize results
        serializer = RecipeSearchSerializer(response.hits, many=True)

        return Response({
            'count': response.hits.total.value,
            'results': serializer.data
        })

    @action(detail=False, methods=['get'])
    def suggest(self, request):
        query = request.GET.get('q', '')

        if not query:
            return Response([])

        # Search for suggestions in title and ingredients
        search = self.get_queryset().query(
            'multi_match',
            query=query,
            fields=['title^2', 'ingredients'],
            fuzziness='AUTO'
        )[:5]  # Limit to 5 suggestions

        response = search.execute()

        suggestions = [
            {
                'id': hit.id,
                'title': hit.title,
                'category': hit.category['name'] if hit.category else None
            }
            for hit in response.hits
        ]

        return Response(suggestions)
