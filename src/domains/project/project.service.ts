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

  async getMyProjects(managerId: number) {
    return await this.projectRepository.find({
      where: {
        manager: { id: managerId },
      },
      relations: {
        task: true,
      },
      order: { creationDate: "DESC" },
    });
  }

  async getAllProjects() {
    return await this.projectRepository.find({
      relations: { manager: true },
      order: { creationDate: "DESC" },
    });
  }
}
