import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { JwtGuard } from '../auth/guard/jwt.guard';
import RoleGuard from '../auth/guard/role.guard';
import { UserOption } from '../auth/strategy/requestWithUser';
import { FetchQueryDto } from '../common/fetch-query.dto';
import { AddCategoryDto } from './dto/add-category.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { FavouriteProjectDto } from './dto/favourite-project.dto';
import { FetchProjectsDto } from './dto/fetch-projects.dto';
import { ProjectService } from './project.service';

@Controller('project')
export class ProjectController {
  constructor(private projectService: ProjectService) {}
  @HttpCode(HttpStatus.CREATED)
  @Post()
  @UseGuards(RoleGuard('admin'))
  @UseGuards(JwtGuard)
  async createProject(@Body() dto: CreateProjectDto) {
    return this.projectService.createNewProject(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async fetchProjects(
    @GetUser() user: UserOption,
    @Query() query: FetchProjectsDto,
  ) {
    return this.projectService.fetchProjects(query);
  }

  @HttpCode(HttpStatus.OK)
  @Post('favourite')
  @UseGuards(RoleGuard('funder'))
  @UseGuards(JwtGuard)
  async addProjectToFavourite(
    @GetUser() user: UserOption,
    @Body() dto: FavouriteProjectDto,
  ) {
    return this.projectService.addProjectAsFavourite(dto, user);
  }

  @HttpCode(HttpStatus.OK)
  @Get('favourite')
  @UseGuards(RoleGuard('funder'))
  @UseGuards(JwtGuard)
  async fetchFavourites(
    @GetUser() user: UserOption,
    @Query() dto: FetchQueryDto,
  ) {
    return this.projectService.fetchFavourites(user, dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('category')
  @UseGuards(RoleGuard('admin'))
  @UseGuards(JwtGuard)
  async addNewCategory(
    @Body() dto: AddCategoryDto,
    @GetUser() user: UserOption,
  ) {
    return this.projectService.addCategory(user, dto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('category')
  async fetchCategories() {
    return this.projectService.fetchCategories();
  }

  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  async fetchProjectById(@Param('id') id: string) {
    return this.projectService.fetchProjectById(id);
  }
}
