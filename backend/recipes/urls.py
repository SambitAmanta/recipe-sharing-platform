from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RecipeViewSet, CategoryViewSet, TagViewSet, CollectionViewSet, CommentViewSet, RecipeSearchViewSet
from .admin_views import (AdminDashboardViewSet, RecipeViewViewSet,
                          RecipeReportViewSet)

router = DefaultRouter()
router.register('recipes', RecipeViewSet, basename='recipe')
router.register('categories', CategoryViewSet, basename='category')
router.register('tags', TagViewSet, basename='tag')
router.register('comments', CommentViewSet, basename='comment')
router.register('collections', CollectionViewSet, basename='collection')
router.register('admin/dashboard', AdminDashboardViewSet,
                basename='admin-dashboard')
router.register('recipe-views', RecipeViewViewSet, basename='recipe-view')
router.register('recipe-reports', RecipeReportViewSet,
                basename='recipe-report')
router.register('search', RecipeSearchViewSet, basename='recipe-search')

urlpatterns = [
    path('', include(router.urls)),
]
