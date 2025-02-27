"""Add transcription table

Revision ID: bcf9e2068b71
Revises: 68d51d105d4f
Create Date: 2025-02-26 20:26:40.153809

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'bcf9e2068b71'
down_revision: Union[str, None] = '68d51d105d4f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.create_table(
        'transcription',
        sa.Column('Id', sa.Integer, primary_key=True),
        sa.Column('fileName', sa.String(255), nullable=True),
        sa.Column('file', sa.String(255), nullable=True),
        sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
    )


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    pass
    # ### end Alembic commands ###
