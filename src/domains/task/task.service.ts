import { TaskStatus } from "../../shared/enums/task-status";
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

  async changeStatusTask(task: Task, status: TaskStatus) {
    task.status = status;
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

  async getTaskByIdAndUserId(id: number, userId: number) {
    return await this.taskRepository.findOne({
      where: {
        id,
        employee: {
          id: userId,
        },
      },
      relations: {
        employee: true,
        project: true,
      },
    });
  }

  async deleteTask(id: number) {
    return await this.taskRepository.delete(id);
  }

  async getMyTasks(managerId: number) {
    return await this.taskRepository.find({
      where: {
        manager: { id: managerId },
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

  async getAllMyTasksForEmployee(employeeId: number, status: string) {
    return await this.taskRepository.find({
      where: {
        status,
        employee: {
          id: employeeId,
        },
      },
      relations: {
        project: {
          manager: true,
        },
        employee: true,
      },
      order: { creationDate: "DESC" },
    });
  }

  async getAllMyTasksForManager(managerId: number, status: string) {
    return await this.taskRepository.find({
      where: {
        status,
        project: {
          manager: {
            id: managerId,
          },
        },
      },
      relations: {
        project: true,
        employee: true,
      },
      order: { creationDate: "DESC" },
    });
  }
}
