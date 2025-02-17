from django.core.management.base import BaseCommand
from django_elasticsearch_dsl.registries import registry


class Command(BaseCommand):
    help = 'Updates Elasticsearch index'

    def handle(self, *args, **options):
        for index in registry.get_indices():
            index.delete(ignore=404)
            self.stdout.write(f'Deleted index {index._name}')
            index.create()
            self.stdout.write(f'Created index {index._name}')

        for doc in registry.get_documents():
            self.stdout.write(f'Indexing {doc._doc_type.model.__name__} model')
            doc().update()
            self.stdout.write(
                f'Successfully indexed {doc._doc_type.model.__name__}')
