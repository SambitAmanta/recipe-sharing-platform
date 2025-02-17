from django_elasticsearch_dsl import Document, fields
from django_elasticsearch_dsl.registries import registry
from .models import Recipe, Category, Tag


@registry.register_document
class RecipeDocument(Document):
    # Author fields
    author = fields.ObjectField(properties={
        'id': fields.IntegerField(),
        'email': fields.TextField(),
        'first_name': fields.TextField(),
        'last_name': fields.TextField(),
    })

    # Category fields
    category = fields.ObjectField(properties={
        'id': fields.IntegerField(),
        'name': fields.TextField(),
    })

    # Tags field
    tags = fields.NestedField(properties={
        'id': fields.IntegerField(),
        'name': fields.TextField(),
    })

    # Additional computed fields
    average_rating = fields.FloatField()
    total_reviews = fields.IntegerField()

    class Index:
        name = 'recipes'
        settings = {
            'number_of_shards': 1,
            'number_of_replicas': 0,
            'analysis': {
                'analyzer': {
                    'ngram_analyzer': {
                        'type': 'custom',
                        'tokenizer': 'ngram_tokenizer',
                        'filter': ['lowercase']
                    }
                },
                'tokenizer': {
                    'ngram_tokenizer': {
                        'type': 'ngram',
                        'min_gram': 3,
                        'max_gram': 10,
                        'token_chars': ['letter', 'digit']
                    }
                }
            }
        }

    class Django:
        model = Recipe
        fields = [
            'id',
            'title',
            'description',
            'ingredients',
            'instructions',
            'cooking_time',
            'difficulty',
            'created_at',
        ]

        # Related fields that should trigger an update
        related_models = [Category, Tag]

    def prepare_average_rating(self, instance):
        return instance.average_rating

    def prepare_total_reviews(self, instance):
        return instance.review_set.count()

    def prepare_author(self, instance):
        return {
            'id': instance.author.id,
            'email': instance.author.email,
            'first_name': instance.author.first_name,
            'last_name': instance.author.last_name,
        }

    def prepare_category(self, instance):
        if instance.category:
            return {
                'id': instance.category.id,
                'name': instance.category.name,
            }
        return None

    def prepare_tags(self, instance):
        return [
            {
                'id': tag.id,
                'name': tag.name,
            }
            for tag in instance.tags.all()
        ]
