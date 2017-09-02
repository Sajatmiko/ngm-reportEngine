/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  // -------- NGM -------- 
  // User authentication / password reset
  'GET /login': 'UserController.login',
  'POST /login': 'UserController.login',
  'POST /create': 'UserController.create',
  'POST /update': 'UserController.updateLogin',
  'POST /send-email': 'UserController.passwordResetEmail',
  'POST /password-reset': 'UserController.passwordReset',

  // org
  'GET /getOrganization': 'OrganizationController.getOrganization',
  'POST /getOrganization': 'OrganizationController.getOrganization',
  'GET /setOrganization': 'OrganizationController.setOrganization',
  'POST /setOrganization': 'OrganizationController.setOrganization',
  'GET /setOrganizationPartner': 'OrganizationController.setOrganizationPartner',
  'POST /setOrganizationPartner': 'OrganizationController.setOrganizationPartner',

  // Metrics
  'POST /metrics/set': 'MetricsController.set',
  'GET /metrics/getUsers': 'MetricsController.getUsers',
  'GET /metrics/getLocations': 'MetricsController.getLocations',
  'GET /metrics/getReports': 'MetricsController.getReports',

  // Upload
  'POST /upload-file': 'FileController.upload',
  'POST /process': 'FileController.process',
  'POST /print': 'FileController.print',
  'POST /proxy': 'FileController.proxy',
  'GET /export': 'FileController.export',
  'GET /getBeneficiairiesCsv': 'FileController.getBeneficiairiesCsv',



  // -------- CLUSTER -------- 
  // Location lists
  'GET /location/getAdmin1List': 'LocationController.getAdmin1List',
  'GET /location/getAdmin2List': 'LocationController.getAdmin2List',
  'GET /location/getAdmin3List': 'LocationController.getAdmin3List',
  'GET /location/getAdmin2Facilities': 'LocationController.getAdmin2Facilities',
  'GET /location/getAdmin3Facilities': 'LocationController.getAdmin3Facilities',


  // Cluster Lists
  'GET /cluster/list/activities': 'Cluster/Lists/ListController.getActivities',
  'GET /cluster/list/donors': 'Cluster/Lists/ListController.getDonors',
  'GET /cluster/list/indicators': 'Cluster/Lists/ListController.getIndicators',
  'GET /cluster/list/stockitems': 'Cluster/Lists/ListController.getStockItems',
  'GET /cluster/list/organizations': 'Cluster/Lists/ListController.getOrganizations',
  
  // ADMIN DASHBOARD
  'POST /cluster/admin/indicator': 'Cluster/Dashboards/AdminDashboardController.getClusterAdminIndicator',

  // PROJECTS
  'POST /cluster/project/getProjectsList': 'Cluster/ProjectController.getProjectsList',
  'POST /cluster/project/getProject': 'Cluster/ProjectController.getProjectById',
  'POST /cluster/project/setProject': 'Cluster/ProjectController.setProjectById',
  'POST /cluster/project/removeBudgetItem': 'Cluster/ProjectController.removeBudgetItemById',
  'POST /cluster/project/removeBeneficiary': 'Cluster/ProjectController.removeBeneficiaryById',
  'POST /cluster/project/removeLocation': 'Cluster/ProjectController.removeLocationById',
  
  'POST /cluster/project/delete': 'Cluster/ProjectController.deleteProjectById',
  'GET /cluster/project/delete': 'Cluster/ProjectController.deleteProjectById',

  // STOCK REPORTS
  'POST /cluster/stock/getReportsList': 'Cluster/Stocks/StockReportController.getReportsList',
  'POST /cluster/stock/getReport': 'Cluster/Stocks/StockReportController.getReportById',
  'POST /cluster/stock/setReport': 'Cluster/Stocks/StockReportController.setReportById',
  'POST /cluster/stock/removeStockLocation': 'Cluster/Stocks/StockReportController.removeReportLocation',

  // ACTIVITY REPORTS
  'POST /cluster/report/getReportCsv': 'Cluster/Reports/ReportController.getReportCsv',
  'POST /cluster/report/getReportsList': 'Cluster/Reports/ReportController.getReportsList',
  'POST /cluster/report/getReport': 'Cluster/Reports/ReportController.getReportById',
  'POST /cluster/report/setReport': 'Cluster/Reports/ReportController.setReportById',
  'POST /cluster/report/removeBeneficiary': 'Cluster/Reports/ReportController.removeBeneficiary',

  // STOCK / ACTIVITY REPORTS TASKS
  'GET /cluster/report/setStocksToDo': 'Cluster/Reports/ReportTasksController.setStocksToDo',
  'GET /cluster/report/setReportsToDo': 'Cluster/Reports/ReportTasksController.setReportsToDo',
  'GET /cluster/report/setReportsOpen': 'Cluster/Reports/ReportTasksController.setReportsOpen',
  'GET /cluster/report/setReportsReminder': 'Cluster/Reports/ReportTasksController.setReportsReminder',

  // CLUSTER DASHBOARD
  // 'GET /cluster/latestUpdate': 'Cluster/Dashboards/ClusterDashboardController.getlatestUpdate',
  'GET /cluster/indicator': 'Cluster/Dashboards/ClusterDashboardController.getIndicator',
  'POST /cluster/indicator': 'Cluster/Dashboards/ClusterDashboardController.getIndicator',


  // -------- HEALTH -------- 
  // 4W Dashboard
  'POST /health/indicator': 'Cluster/Health/HealthDashboardController.getHealthDetails',
  'POST /health/data/contacts': 'Cluster/Health/HealthDashboardController.getContactListCsv',


  // -------- EPR -------- 
  'GET /epr/getKoboData': 'Epr/EprController.getKoboData',
  // EPR Dashboard
  'GET /epr/latestUpdate': 'Epr/EprDashboardController.getlatestUpdate',
  // Epr
  'GET /epr/indicator': 'Epr/EprDashboardController.getEprIndicator',
  'POST /epr/indicator': 'Epr/EprDashboardController.getEprIndicator',
  // alerts
  'GET /epr/alerts/indicator': 'Epr/EprDashboardController.getAlertIndicator',
  'POST /epr/alerts/indicator': 'Epr/EprDashboardController.getAlertIndicator',
  'GET /epr/alerts/data': 'Epr/EprDashboardController.getAlertData',
  'POST /epr/alerts/data': 'Epr/EprDashboardController.getAlertData',
  // disasters
  'GET /epr/disasters/indicator': 'Epr/EprDashboardController.getDisasterIndicator',
  'POST /epr/disasters/indicator': 'Epr/EprDashboardController.getDisasterIndicator',
  'GET /epr/disasters/data': 'Epr/EprDashboardController.getDisasterData',
  'POST /epr/disasters/data': 'Epr/EprDashboardController.getDisasterData',


  // -------- DEWS -------- 
  'POST /dews/indicator': 'Dews/DewsController.getIndicator',
  'POST /dews/chart': 'Dews/DewsController.getChart',
  'POST /dews/calendar': 'Dews/DewsController.getCalendar',
  'POST /dews/summary': 'Dews/DewsController.getSummary',
  'POST /dews/data': 'Dews/DewsController.getData',
  'POST /dews/markers': 'Dews/DewsController.getMarkers',
  'POST /dews/map': 'Dews/DewsController.getMap',


  // -------- WATCHKEEPER -------- 
  'POST /wk/calendar': 'Watchkeeper/WatchkeeperController.getCalendar',
  'POST /wk/indicator': 'Watchkeeper/WatchkeeperController.getIndicator',
  'POST /wk/difference': 'Watchkeeper/WatchkeeperController.getDifference',
  'POST /wk/markers': 'Watchkeeper/WatchkeeperController.getMarkers',
  'POST /wk/data': 'Watchkeeper/WatchkeeperController.getData',
  'POST /wk/chart': 'Watchkeeper/WatchkeeperController.getChart',

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};
