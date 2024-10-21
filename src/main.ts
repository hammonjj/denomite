import { Application } from '@oak/oak';
import { adminRoutes } from './routes/adminRoutes.ts';
import { userRoutes } from './routes/userRoutes.ts';
import { logger } from './middleware/loggerMiddleware.ts';
import { PORT } from './environmentVariables.ts';
import { initializeDependencies } from "./utils/diContainer.ts";

import { StaticFileMiddleware } from "./middleware/staticFileMiddleware.ts";
import { groupRoutes } from './routes/groupRoutes.ts';
import { userGroupRoutes } from './routes/userGroupRoutes.ts';

initializeDependencies();

const app = new Application();

// Middleware
app.use(logger);
app.use(StaticFileMiddleware);

// User Management Routes
app.use(userRoutes.routes());
app.use(userRoutes.allowedMethods());

// Admin Interface Routes
app.use(adminRoutes.routes());
app.use(adminRoutes.allowedMethods());

// Group Routes
app.use(groupRoutes.routes());
app.use(groupRoutes.allowedMethods());

// User Group Routes
app.use(userGroupRoutes.routes());
app.use(userGroupRoutes.allowedMethods());

app.listen({ port: PORT });

console.log(`Server running on port ${PORT}`);
export default app;
