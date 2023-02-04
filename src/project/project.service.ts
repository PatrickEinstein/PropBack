import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserOption } from '../auth/strategy/requestWithUser';
import { BaseService } from '../common/BaseService';
import { FetchQueryDto } from '../common/fetch-query.dto';
import { AddCategoryDto } from './dto/add-category.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { FavouriteProjectDto } from './dto/favourite-project.dto';
import { FetchProjectsDto } from './dto/fetch-projects.dto';
import { Category, CategoryDocument } from './schema/category.schema';
import {
  FavouriteProject,
  FavouriteProjectDocument,
} from './schema/favourite-project.schema';
import { Project, ProjectDocument } from './schema/project.schema';

@Injectable()
export class ProjectService extends BaseService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    private config: ConfigService,
    @InjectModel(FavouriteProject.name)
    private favouriteProjectModel: Model<FavouriteProjectDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {
    super();
  }

  async createNewProject(dto: CreateProjectDto) {
    const { imageKey, ...rest } = dto;
    const imageUrl = this.config.getOrThrow('AWS_S3_URL') + imageKey;
    const check = await this.projectModel.findOne({
      name: dto.name,
    });
    if (check) {
      throw new BadRequestException('This project name exists already');
    }

    const project = await this.projectModel.create({
      ...rest,
      imageUrl,
    });

    return {
      ...project.toObject(),
      message: 'Project created succesfully',
    };
  }

  async fetchProjects(body: FetchProjectsDto) {
    const data = await this.getPaginatedReponse({ ...body }, this.projectModel);

    return {
      ...data,
      message: 'Projects fetched successfully',
    };
  }

  async addProjectAsFavourite(body: FavouriteProjectDto, user: UserOption) {
    if (user.type !== 'funder') {
      throw new ForbiddenException('Not a funder');
    }

    const project = await this.projectModel.findById(body.project);
    if (!project) {
      throw new BadRequestException('Invalid project');
    }

    await this.favouriteProjectModel.create({
      project: project._id,
      funder: user.funder._id,
    });

    return {
      message: 'Project added as favourite',
    };
  }

  async fetchFavourites(user: UserOption, dto: FetchQueryDto) {
    if (user.type !== 'funder') {
      throw new ForbiddenException('Not a funder');
    }

    dto.populate = 'project funder';

    const data = await this.getPaginatedReponse(
      { ...dto, funder: user.funder._id },
      this.favouriteProjectModel,
    );

    return {
      ...data,
      message: 'Fetched funder favourite projects successfully',
    };
  }

  async fetchCategories() {
    const categories = await this.categoryModel.findOne({});
    return {
      data: categories?.fields || [],
      message: 'Fetched categories successfully',
    };
  }

  async addCategory(user: UserOption, dto: AddCategoryDto) {
    if (user.type !== 'admin') {
      throw new ForbiddenException('Not an admin');
    }

    await this.categoryModel.findOneAndUpdate(
      {},
      { $push: { fields: dto.field } },
      { upsert: true },
    );

    return {
      message: 'Category added successfully',
    };
  }

  async fetchProjectById(id: string) {
    const project = await this.projectModel.findById(id);

    return {
      data: project,
      message: 'Project fetched by id',
    };
  }
}
