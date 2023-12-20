import { TaskStatus } from "../../shared/enums/task-status";
import { IRelationFiltrationOptions } from "../../shared/models/relation-filtration-options";
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

  async getAllTasksForProject(requestDetails: any) {
    const limit = requestDetails.pageSize;
    const skipBy = (requestDetails.pageNumber - 1) * limit;
    const findOptions: IRelationFiltrationOptions = {
      skip: skipBy,
      take: limit,
      where: {
        project: {
          id: requestDetails.projectId,
        },
      },
      tableRelationsAndSelect: [
        { navigationPropertyName: "task.employee", selector: "employee" },
      ],
      orderBy: { "task.creationDate": "DESC" },
      queryBuilderCreationPropertyName: "task",
    };
    return await this.taskRepository.findQueryBuilderAndCount(findOptions);
  }

  async getAllMyTasksForEmployee(requestDetails: any) {
    const limit = requestDetails.pageSize;
    const skipBy = (requestDetails.pageNumber - 1) * limit;
    const findOptions: IRelationFiltrationOptions = {
      skip: skipBy,
      take: limit,
      where: {
        ...(requestDetails.status && { status: requestDetails.status }),
      },
      tableRelationsAndSelect: [
        { navigationPropertyName: "task.project", selector: "project" },
        { navigationPropertyName: "task.employee", selector: "employee" },
      ],
      relationFiltration:[`employee.id = ${requestDetails.employeeId}`],
      orderBy: { "task.creationDate": "DESC" },
      queryBuilderCreationPropertyName: "task",
    };
    return await this.taskRepository.findQueryBuilderAndCount(findOptions);
  }

  async getAllCountMyTasksForEmployee(employeeId: number, status: string) {
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

  async getAllMyTasksForManager(requestDetails: any) {
    const limit = requestDetails.pageSize;
    const skipBy = (requestDetails.pageNumber - 1) * limit;
    const findOptions: IRelationFiltrationOptions = {
      skip: skipBy,
      take: limit,
      where: {
        ...(requestDetails.status && { status: requestDetails.status }),
      },
      tableRelationsAndSelect: [
        { navigationPropertyName: "task.project", selector: "project" },
        { navigationPropertyName: "task.employee", selector: "employee" },
        { navigationPropertyName: "project.manager", selector: "manager" },
      ],
      relationFiltration: [`manager.id = ${requestDetails.managerId}`],
      orderBy: { "task.creationDate": "DESC" },
      queryBuilderCreationPropertyName: "task",
    };
    return await this.taskRepository.findQueryBuilderAndCount(findOptions);
  }

  async getAllCountMyTasksForManager(managerId: number, status: string) {
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
