import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    // get session from context
    const request = context.switchToHttp().getRequest();
    const currentUser = request.currentUser;
    console.log('currentUser', currentUser);
    return currentUser;
  },
);
