from rest_framework import serializers
from .models import Recipe, Category, Tag, Rating, Review, Collection, Comment, RecipeReport, RecipeView


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ['id', 'recipe', 'user', 'value', 'created_at']
        read_only_fields = ['user']


class ReviewSerializer(serializers.ModelSerializer):
    upvote_count = serializers.SerializerMethodField()
    downvote_count = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ['id', 'recipe', 'user', 'content', 'created_at',
                  'updated_at', 'upvote_count', 'downvote_count']
        read_only_fields = ['user']

    def get_upvote_count(self, obj):
        return obj.upvotes.count()

    def get_downvote_count(self, obj):
        return obj.downvotes.count()


class RecipeSerializer(serializers.ModelSerializer):
    average_rating = serializers.FloatField(read_only=True)
    author_name = serializers.SerializerMethodField()
    category_name = serializers.SerializerMethodField()
    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        write_only=True,
        queryset=Tag.objects.all(),
        source='tags'
    )

    class Meta:
        model = Recipe
        fields = ['id', 'title', 'description', 'author', 'author_name',
                  'ingredients', 'instructions', 'cooking_time', 'difficulty',
                  'category', 'category_name', 'tags', 'tag_ids', 'image',
                  'created_at', 'updated_at', 'average_rating']
        read_only_fields = ['author', 'created_at', 'updated_at']

    def get_author_name(self, obj):
        return f"{obj.author.first_name} {obj.author.last_name}".strip()

    def get_category_name(self, obj):
        return obj.category.name if obj.category else None


class CommentSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'recipe', 'user', 'user_name', 'content',
                  'created_at', 'updated_at']
        read_only_fields = ['user']

    def get_user_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip()


class CollectionSerializer(serializers.ModelSerializer):
    recipe_count = serializers.SerializerMethodField()

    class Meta:
        model = Collection
        fields = ['id', 'name', 'description', 'user', 'recipes',
                  'is_public', 'created_at', 'updated_at', 'recipe_count']
        read_only_fields = ['user']

    def get_recipe_count(self, obj):
        return obj.recipes.count()


class RecipeViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeView
        fields = ['id', 'recipe', 'viewer', 'viewed_at', 'ip_address']
        read_only_fields = ['viewer', 'ip_address']


class RecipeReportSerializer(serializers.ModelSerializer):
    reporter_name = serializers.SerializerMethodField()

    class Meta:
        model = RecipeReport
        fields = ['id', 'recipe', 'reporter', 'reporter_name', 'reason',
                  'description', 'created_at', 'resolved', 'resolved_by',
                  'resolution_note']
        read_only_fields = ['reporter', 'resolved_by']

    def get_reporter_name(self, obj):
        if obj.reporter:
            return f"{obj.reporter.first_name} {obj.reporter.last_name}".strip()
        return "Anonymous"


class RecipeSearchSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    title = serializers.CharField()
    description = serializers.CharField()
    author = serializers.DictField()
    category = serializers.DictField(allow_null=True)
    tags = serializers.ListField()
    average_rating = serializers.FloatField()
    total_reviews = serializers.IntegerField()
    cooking_time = serializers.IntegerField()
    difficulty = serializers.CharField()
    created_at = serializers.DateTimeField()
