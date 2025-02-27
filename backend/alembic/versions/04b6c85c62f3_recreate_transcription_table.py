"""Recreate transcription table

Revision ID: 04b6c85c62f3
Revises: bcf9e2068b71
Create Date: 2025-02-26 20:35:36.845913

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '04b6c85c62f3'
down_revision: Union[str, None] = 'bcf9e2068b71'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('transcription',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('file_name', sa.String(length=255), nullable=True),
    sa.Column('transcription_text', sa.Text(), nullable=True),
    sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_transcription_id'), 'transcription', ['id'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_transcription_id'), table_name='transcription')
    op.drop_table('transcription')
    # ### end Alembic commands ###
