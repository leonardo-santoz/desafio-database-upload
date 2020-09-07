import { getRepository } from 'typeorm';

import Category from '../models/Category';
import AppError from '../errors/AppError';

interface Request {
  title: string;
}

class CreateCategoryService {
  public async execute({ title }: Request): Promise<Category> {
    const categoryRepository = getRepository(Category);

    const categoryTitleExists = await categoryRepository.findOne({
      where: { title },
    });

    if (categoryTitleExists) throw new AppError('Title is already in use', 400);

    const category = categoryRepository.create({
      title,
    });

    categoryRepository.save(category);

    return category;
  }
}

export default CreateCategoryService;
