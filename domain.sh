#!/bin/bash

# Get the folder name as a command-line argument
FOLDER_NAME=$1

# Create the folder
mkdir src/domains/$FOLDER_NAME
mkdir src/domains/$FOLDER_NAME/models
path_folder_name=src/domains/$FOLDER_NAME

# Capitalize the first letter of the folder name to get the class name
CLASS_NAME="$(tr '[:lower:]' '[:upper:]' <<<${FOLDER_NAME:0:1})${FOLDER_NAME:1}"

########################################################################################
# Create the routes.ts file and add code to it
ROUTES_FILE="$path_folder_name/$FOLDER_NAME.routes.ts"

touch $ROUTES_FILE
echo "import { Router } from 'express';
import { IRouterBase } from '../../shared/abstractions/router-base';
import { ${CLASS_NAME}Controller } from './${FOLDER_NAME}.controller';

class ${CLASS_NAME}Router implements IRouterBase<${CLASS_NAME}Controller>  {

    router: Router;
    controller: ${CLASS_NAME}Controller;

    constructor() {
        this.router = Router();
        this.controller = new ${CLASS_NAME}Controller();
        this.addRoutes();
    }

    getRouter(): Router {
        return this.router;
    }

    addRoutes(): void {
        // add routes here
    }

}

export const ${FOLDER_NAME}Routes: Router = new ${CLASS_NAME}Router().getRouter();" >>$ROUTES_FILE

# Create the entity.ts file and add code to it
ENTITY_FILE="$path_folder_name/$FOLDER_NAME.entity.ts"
touch $ENTITY_FILE

echo "import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('${FOLDER_NAME}')
export class ${CLASS_NAME} {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @CreateDateColumn()
  creationDate!: Date;

  @Column()
  @UpdateDateColumn()
  modificationDate!: Date;
}
" >>$ENTITY_FILE

########################################################################################
# Create the service.ts file and add code to it
SERVICE_FILE="$path_folder_name/$FOLDER_NAME.service.ts"
touch $SERVICE_FILE

echo "import { IGenericRepository } from '../../shared/repository/abstractions/generic-repository';
import { GenericRepository } from '../../shared/repository/implementations/generic-repository';
import { $CLASS_NAME } from './${FOLDER_NAME}.entity';


export class ${CLASS_NAME}Service {
    private readonly ${FOLDER_NAME}Repository: IGenericRepository<${CLASS_NAME}>;

    constructor() {
        this.${FOLDER_NAME}Repository = new GenericRepository(${CLASS_NAME});
    }

}" >>$SERVICE_FILE
########################################################################################
CONTROLLER_FILE="$path_folder_name/$FOLDER_NAME.controller.ts"
touch $CONTROLLER_FILE

echo "import { ${CLASS_NAME}Service } from './${FOLDER_NAME}.service';

export class ${CLASS_NAME}Controller {
    private readonly ${FOLDER_NAME}Service: ${CLASS_NAME}Service;
  
    constructor() {
        this.${FOLDER_NAME}Service = new ${CLASS_NAME}Service();
    }
}
" >>$CONTROLLER_FILE