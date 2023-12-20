import { IPaginatedRequest } from "../../shared/models/paginated-request";
import { IRelationFiltrationOptions } from "../../shared/models/relation-filtration-options";
import { IGenericRepository } from "../../shared/repository/abstractions/generic-repository";
import { GenericRepository } from "../../shared/repository/implementations/generic-repository";
import { User } from "../users/entities/user.entity";
import { ProjectDto } from "./models/project.dto";
import { Project } from "./project.entity";

export class ProjectService {
  private readonly projectRepository: IGenericRepository<Project>;

  constructor() {
    this.projectRepository = new GenericRepository(Project);
  }

  async createProject(projectDto: ProjectDto) {
    const project = new Project();
    project.title = projectDto.title;
    project.description = projectDto.description;
    const manager = new User();
    manager.id = projectDto.managerId;
    project.manager = manager;
    return await this.projectRepository.create(project);
  }

  async updateProject(projectDto: ProjectDto) {
    const project = new Project();
    if (projectDto.projectId) project.id = projectDto.projectId;
    project.title = projectDto.title;
    project.description = projectDto.description;
    return await this.projectRepository.update(project);
  }

  async getProjectById(id: number) {
    return await this.projectRepository.findOne({
      where: { id },
      relations: {
        task: true,
        manager: true,
      },
    });
  }

  async deleteProject(id: number) {
    return await this.projectRepository.delete(id);
  }

  async getMyProjectsForManager(requestDetails: any) {
    const limit = requestDetails.pageSize;
    const skipBy = (requestDetails.pageNumber - 1) * limit;
    const findOptions: IRelationFiltrationOptions = {
      where: {
        manager: { id: requestDetails.managerId },
      },
      skip: skipBy,
      take: limit,
      orderBy: { "project.creationDate": "DESC" },
      queryBuilderCreationPropertyName: "project",
      tableRelationsAndSelect: [
        { navigationPropertyName: "project.task", selector: "task" },
      ],
    };
    return await this.projectRepository.findQueryBuilderAndCount(findOptions);
  }

  async getMyProjectsForEmployee(requestDetails: any) {
    const limit = requestDetails.pageSize;
    const skipBy = (requestDetails.pageNumber - 1) * limit;
    const findOptions: IRelationFiltrationOptions = {
      skip: skipBy,
      take: limit,
      orderBy: { "project.creationDate": "DESC" },
      tableRelationsAndSelect: [
        { navigationPropertyName: "project.task", selector: "task" },
        { navigationPropertyName: "task.employee", selector: "employee" },
      ],
      relationFiltration:[`employee.id = ${requestDetails.employeeId}`],
      queryBuilderCreationPropertyName: "project",
    };
    return await this.projectRepository.findQueryBuilderAndCount(findOptions);
  }

  async getAllProjects(requestDetails: IPaginatedRequest) {
    const limit = requestDetails.pageSize;
    const skipBy = (requestDetails.pageNumber - 1) * limit;
    const findOptions: IRelationFiltrationOptions = {
      skip: skipBy,
      take: limit,
      tableRelationsAndSelect: [
        { navigationPropertyName: "project.manager", selector: "manager" },
      ],
      orderBy: { "project.creationDate": "DESC" },
      queryBuilderCreationPropertyName: "project",
    };
    return await this.projectRepository.findQueryBuilderAndCount(findOptions);
  }
}
