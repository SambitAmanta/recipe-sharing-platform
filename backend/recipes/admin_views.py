from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Avg
from django.db.models.functions import TruncDate
from django.utils import timezone
from datetime import timedelta
from .models import Recipe, RecipeView, RecipeReport, Rating, Review
from .serializers import (RecipeSerializer, RecipeViewSerializer,
                          RecipeReportSerializer)


class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_staff


class AdminDashboardViewSet(viewsets.ViewSet):
    permission_classes = [IsAdminUser]

    @action(detail=False, methods=['get'])
    def analytics(self, request):
        # Get date range from query params or default to last 30 days
        days = int(request.query_params.get('days', 30))
        start_date = timezone.now() - timedelta(days=days)

        # Get recipe views over time
        views = RecipeView.objects.filter(
            viewed_at__gte=start_date
        ).annotate(
            date=TruncDate('viewed_at')
        ).values('date').annotate(
            count=Count('id')
        ).order_by('date')

        # Get top recipes
        top_recipes = Recipe.objects.annotate(
            view_count=Count('views'),
            avg_rating=Avg('rating__value')
        ).order_by('-view_count')[:10]

        # Get user engagement
        user_engagement = {
            'total_recipes': Recipe.objects.count(),
            'total_ratings': Rating.objects.count(),
            'total_reviews': Review.objects.count(),
            'total_views': RecipeView.objects.count(),
        }

        return Response({
            'views_over_time': views,
            'top_recipes': RecipeSerializer(top_recipes, many=True).data,
            'user_engagement': user_engagement
        })

    @action(detail=False, methods=['get'])
    def reported_recipes(self, request):
        reports = RecipeReport.objects.filter(
            resolved=False
        ).order_by('-created_at')
        return Response(RecipeReportSerializer(reports, many=True).data)

    @action(detail=True, methods=['post'])
    def resolve_report(self, request, pk=None):
        try:
            report = RecipeReport.objects.get(pk=pk)
        except RecipeReport.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        resolution_note = request.data.get('resolution_note', '')
        action = request.data.get('action', 'keep')  # 'keep' or 'delete'

        report.resolved = True
        report.resolved_by = request.user
        report.resolution_note = resolution_note
        report.save()

        if action == 'delete':
            report.recipe.delete()

        return Response(RecipeReportSerializer(report).data)


class RecipeViewViewSet(viewsets.ModelViewSet):
    queryset = RecipeView.objects.all()
    serializer_class = RecipeViewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(
            viewer=self.request.user,
            ip_address=self.request.META.get('REMOTE_ADDR')
        )


class RecipeReportViewSet(viewsets.ModelViewSet):
    queryset = RecipeReport.objects.all()
    serializer_class = RecipeReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(reporter=self.request.user)
