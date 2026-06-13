/**
 *  @swagger
 * /auth:
 *   get:
 *     summary: Render authentication page
 *     description: >
 *       Renders the authentication page using server-side rendering (EJS).
 *       This endpoint returns an HTML page and is not a JSON API response.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Authentication page rendered successfully
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /auth/check-email:
 *   post:
 *     summary: Check if email is already registered
 *     description: >
 *       Checks whether an email exists in the system.
 *       Based on the result, the client decides whether to continue with login or signup flow.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CheckEmailRequest'
 *     responses:
 *       200:
 *         description: Email check completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CheckEmailResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     CheckEmailRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *
 *     CheckEmailResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         action:
 *           type: string
 *           enum:
 *             - login required
 *             - signup required
 *           example: login required
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: error
 *         error_code:
 *           type: string
 *           example: check_email_failed
 *         message:
 *           type: string
 *           example: Internal server error
 */
/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register new user
 *     description: Create a new user account with fullname, email, username and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *                 example: Younes Fratagone
 *               email:
 *                 type: string
 *                 example: younes@example.com
 *               username:
 *                 type: string
 *                 example: younes
 *               password:
 *                 type: string
 *                 example: StrongPass123
 *     responses:
 *       302:
 *         description: Redirect to login page after success.
 *       400:
 *         description: Validation error or user creation failed.
 *       500:
 *         description: Internal server error.
 */
/**
 *  @swagger
 * /auth/login:
 *  post:
 *    tags:
 *      - Authentication
 *    summary: User login
 *    description: Authenticate user with email and password
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - email
 *              - password
 *            properties:
 *              email:
 *                type: string
 *                format: email
 *                example: user@example.com
 *              password:
 *                type: string
 *                format: password
 *                example: password123
 *    responses:
 *      200:
 *        description: Login successful
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                  example: success
 *                message:
 *                  type: string
 *                  example: Login successful
 *                data:
 *                  type: object
 *                  properties:
 *                    user:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: string
 *                          example: 507f1f77bcf86cd799439011
 *                        email:
 *                          type: string
 *                          example: user@example.com
 *                        fullname:
 *                          type: string
 *                          example: John Doe
 *                        username:
 *                          type: string
 *                          example: johndoe
 *      400:
 *        description: Bad request
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                  example: error
 *                message:
 *                  type: string
 *                  example: Email and password are required
 *      401:
 *        description: Unauthorized
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                  example: error
 *                error_code:
 *                  type: string
 *                  example: authentication_failed
 *                message:
 *                  type: string
 *                  example: Invalid email or password
*/
/**
 * @swagger
 * /auth/logout:
 *  get:
 *    tags:
 *      - Authentication
 *    summary: User logout
 *    description: Destroy user session and logout
 *    responses:
 *      200:
 *        description: Logout successful
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                  example: success
 *                message:
 *                  type: string
 *                  example: Logout successful
 *      500:
 *        description: Internal server error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                  example: error
 *                error_code:
 *                  type: string
 *                  example: logout_failed
 *                message:
 *                  type: string
 *                  example: Failed to logout
*/