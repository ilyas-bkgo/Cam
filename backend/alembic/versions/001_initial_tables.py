"""initial tables for quotes, interventions, cameras, testimonials

Revision ID: 001_initial_tables
Revises: 
Create Date: 2026-10-06 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

revision = '001_initial_tables'
down_revision = None
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Quotes table
    op.create_table(
        'quotes',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('tracking_code', sa.String(length=50), nullable=False),
        sa.Column('client_name', sa.String(length=100), nullable=False),
        sa.Column('email', sa.String(length=120), nullable=False),
        sa.Column('phone', sa.String(length=30), nullable=False),
        sa.Column('address', sa.String(length=200), nullable=True),
        sa.Column('property_type', sa.String(length=50), server_default='maison'),
        sa.Column('camera_count', sa.Integer(), server_default='4'),
        sa.Column('resolution', sa.String(length=50), server_default='4K'),
        sa.Column('storage_preference', sa.String(length=50), server_default='nvr_local'),
        sa.Column('needs_ai_detection', sa.Boolean(), server_default='true'),
        sa.Column('needs_night_color', sa.Boolean(), server_default='true'),
        sa.Column('needs_remote_app', sa.Boolean(), server_default='true'),
        sa.Column('estimated_price', sa.Float(), server_default='0.0'),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('status', sa.String(length=50), server_default='nouveau'),
        sa.Column('admin_notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_quotes_id'), 'quotes', ['id'], unique=False)
    op.create_index(op.f('ix_quotes_tracking_code'), 'quotes', ['tracking_code'], unique=True)
    op.create_index(op.f('ix_quotes_status'), 'quotes', ['status'], unique=False)

    # Interventions table
    op.create_table(
        'interventions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('tracking_code', sa.String(length=50), nullable=False),
        sa.Column('client_name', sa.String(length=100), nullable=False),
        sa.Column('email', sa.String(length=120), nullable=False),
        sa.Column('phone', sa.String(length=30), nullable=False),
        sa.Column('address', sa.String(length=200), nullable=True),
        sa.Column('issue_type', sa.String(length=50), server_default='camera_offline'),
        sa.Column('priority', sa.String(length=50), server_default='urgente'),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('preferred_date', sa.String(length=50), server_default='Immédiat (< 2h)'),
        sa.Column('time_slot', sa.String(length=50), server_default='express_2h'),
        sa.Column('status', sa.String(length=50), server_default='en_attente'),
        sa.Column('technician', sa.String(length=100), nullable=True),
        sa.Column('admin_notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_interventions_id'), 'interventions', ['id'], unique=False)
    op.create_index(op.f('ix_interventions_tracking_code'), 'interventions', ['tracking_code'], unique=True)

    # Cameras table
    op.create_table(
        'cameras',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=120), nullable=False),
        sa.Column('category', sa.String(length=50), server_default='dome'),
        sa.Column('resolution', sa.String(length=50), server_default='4K'),
        sa.Column('night_vision', sa.String(length=100), nullable=True),
        sa.Column('price', sa.Float(), nullable=False),
        sa.Column('installation_included', sa.Boolean(), server_default='true'),
        sa.Column('features', sa.Text(), nullable=True),
        sa.Column('in_stock', sa.Boolean(), server_default='true'),
        sa.Column('badge', sa.String(length=50), nullable=True),
        sa.Column('image_url', sa.String(length=255), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_cameras_id'), 'cameras', ['id'], unique=False)

    # Testimonials table
    op.create_table(
        'testimonials',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('author', sa.String(length=100), nullable=False),
        sa.Column('company_or_role', sa.String(length=100), nullable=True),
        sa.Column('location', sa.String(length=100), nullable=True),
        sa.Column('rating', sa.Integer(), server_default='5'),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('date', sa.String(length=50), nullable=True),
        sa.Column('service_type', sa.String(length=100), server_default='Installation'),
        sa.Column('verified', sa.Boolean(), server_default='true'),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_testimonials_id'), 'testimonials', ['id'], unique=False)

def downgrade() -> None:
    op.drop_table('testimonials')
    op.drop_table('cameras')
    op.drop_table('interventions')
    op.drop_table('quotes')
