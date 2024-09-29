"""user_owner

Revision ID: 7ed8b8fdfdb3
Revises: 137809b176a8
Create Date: 2023-11-14 06:35:23.365673

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = '7ed8b8fdfdb3'
down_revision: Union[str, None] = '137809b176a8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('contacts', sa.Column('user_id', sa.Integer(), nullable=False))
    op.create_foreign_key(None, 'contacts', 'users', ['user_id'], ['id'])


def downgrade() -> None:
    op.drop_constraint(None, 'contacts', type_='foreignkey')
    op.drop_column('contacts', 'user_id')
