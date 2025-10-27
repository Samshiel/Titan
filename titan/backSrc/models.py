from pydantic import BaseModel, Field, validator

class Label(BaseModel):
    imageId: str = Field(..., min_length=1, max_length=50)
    label: str = Field(..., min_length=1, max_length=100)
    
    @validator('label')
    def validate_label(cls, v):
        if not v.strip():
            raise ValueError('Label cannot be empty or whitespace')
        return v.strip()
    
    @validator('imageId')
    def validate_image_id(cls, v):
        if not v.startswith('image_'):
            raise ValueError('Invalid imageId format')
        return v

