import { IGenericRepository } from "../../shared/repository/abstractions/generic-repository";
import { GenericRepository } from "../../shared/repository/implementations/generic-repository";
import { Project } from "../project/project.entity";
import { User } from "../users/entities/user.entity";
import { TaskDto } from "./models/task.dto";
import { Task } from "./task.entity";

export class TaskService {
  private readonly taskRepository: IGenericRepository<Task>;

  constructor() {
    this.taskRepository = new GenericRepository(Task);
  }

  async createTask(taskDto: TaskDto) {
    const task = new Task();
    task.title = taskDto.title;
    task.description = taskDto.description;
    const employee = new User();
    employee.id = taskDto.employeeId;
    task.employee = employee;
    const project = new Project();
    project.id = taskDto.projectId;
    task.project = project;
    return await this.taskRepository.create(task);
  }

  async updateTask(taskDto: TaskDto) {
    const task = new Task();
    if (taskDto.taskId) task.id = taskDto.taskId;
    task.title = taskDto.title;
    task.description = taskDto.description;
    const employee = new User();
    employee.id = taskDto.employeeId;
    task.employee = employee;
    return await this.taskRepository.update(task);
  }

  async getTaskById(id: number) {
    return await this.taskRepository.findOne({
      where: { id },
      relations: {
        employee: true,
        project: true,
      },
    });
  }

  async deleteTask(id: number) {
    return await this.taskRepository.delete(id);
  }

  async getMyTasks(adminId: number) {
    return await this.taskRepository.find({
      where: {
        admin: { id: adminId },
      },
      order: { creationDate: "DESC" },
    });
  }

  async getAllTasksForProject(projectId: number) {
    return await this.taskRepository.find({
      where: {
        project: {
          id: projectId,
        },
      },
      relations: {
        employee: true,
      },
      order: { creationDate: "DESC" },
    });
  }

  async getAllMyTasks(employeeId: number) {
    return await this.taskRepository.find({
      where: {
        employee: {
          id: employeeId,
        },
      },
      relations: {
        project: {
          admin: true,
        },
      },
      order: { creationDate: "DESC" },
    });
  }
}