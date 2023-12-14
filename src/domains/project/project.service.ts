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
    const admin = new User();
    admin.id = projectDto.adminId;
    project.admin = admin;
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
        admin: true,
      },
    });
  }

  async deleteProject(id: number) {
    return await this.projectRepository.delete(id);
  }

  async getMyProjects(adminId: number) {
    return await this.projectRepository.find({
      where: {
        admin: { id: adminId },
      },
      relations: {
        task: true,
      },
      order: { creationDate: "DESC" },
    });
  }

  async getAllProjects() {
    return await this.projectRepository.find({
      order: { creationDate: "DESC" },
    });
  }
}
