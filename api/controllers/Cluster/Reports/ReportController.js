/**
 * ReportController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */



module.exports = {

  // request as csv
  getReportCsv: function( req, res ) {

    // request input
    if ( !req.param( 'report_type' ) || !req.param( 'report_id' ) ) {
      return res.json( 401, { err: 'report_type & report_id required!' });
    }

    var json2csv = require( 'json2csv' ),
      moment = require( 'moment' );

    // activity 
    if ( req.param( 'report_type' ) === 'activity' ) {

      var fields = [
            'project_id',
            'report_id',
            'cluster',
            'organization',
            'username',
            'email',
            'project_hrp_code',
            'project_title',
            'project_code',
            'admin0name',
            'admin1pcode',
            'admin1name',
            'admin2pcode',
            'admin2name',
            'facility_type_name',
            'facility_name',
            'report_month',
            'report_year',
            'activity_type_name',
            'activity_description_name',
            'category_type_name',
            'beneficiary_type_name',
            'delivery_type_name',
            'units',
            'unit_type_name',
            'households',
            'families',
            'boys',
            'girls',
            'men',
            'women',
            'elderly_men',
            'elderly_women',
            'total',
            'createdAt',
            'updatedAt'
          ],
          fieldNames = [ 
            'Project ID', 
            'Report ID', 
            'Cluster',
            'Organization', 
            'Username', 
            'Email', 
            'HRP Code',
            'Project Title',
            'Project Code',
            'Country',
            'Admin1 Pcode',
            'Admin1 Name',
            'Admin2 Pcode',
            'Admin2 Name',
            'Report Month',
            'Report Year',
            'Location Type',
            'Location Name',
            'Activity Type',
            'Activity Description',
            'Category Ttype',
            'Beneficiary Type',
            'Delivery',
            'Unit',
            'Unit Type',
            'Households',
            'Families',
            'Boys',
            'Girls',
            'Men',
            'Women',
            'Elderly Men',
            'Elderly Women',
            'Total',
            'Created',
            'Last Update'
          ];

      // beneficiaries
      Beneficiaries
        .find( )
        .where( { report_id: req.param( 'report_id' ) } )
        .exec(function( err, response ){

          // error
          if ( err ) return res.negotiate( err );

          // format  / sum
          response.forEach(function( d, i ){
            response[i].report_month = moment( response[i].reporting_period ).format( 'MMMM' );
            response[i].total = response[i].boys + 
                                response[i].girls + 
                                response[i].men + 
                                response[i].women + 
                                response[i].elderly_men + 
                                response[i].elderly_women;
          });

          // return csv
          json2csv({ data: response, fields: fields, fieldNames: fieldNames }, function( err, csv ) {
              
            // error
            if ( err ) return res.negotiate( err );

            // success
            return res.json( 200, { data: csv } );

          });

        });

    } else {

      var fields = [
            'organization_id',
            'report_id',
            'organization',
            'username',
            'email',
            'admin0name',
            'admin1pcode',
            'admin1name',
            'admin2pcode',
            'admin2name',
            'facility_name',
            'report_month',
            'report_year',
            'cluster',
            'stock_item_name',
            'stock_status_name',
            'number_in_stock',
            'number_in_pipeline',
            'unit_type_name',
            'beneficiaries_covered',
            'createdAt',
            'updatedAt'
          ],
          fieldNames = [ 
            'Organization ID',
            'Report ID', 
            'Organization', 
            'Username', 
            'Email', 
            'Country',
            'Admin1 Pcode',
            'Admin1 Name',
            'Admin2 Pcode',
            'Admin2 Name',
            'Warehouse Name',
            'Stock Month',
            'Stock Year',
            'Cluster',
            'Stock Type',
            'Status',
            'No. in Stock',
            'No. in Pipeline',
            'Units',
            'Beneficiary Coverage',
            'Created',
            'Last Update'
          ];

      // stocks
      Stock
        .find( )
        .where( { report_id: req.param( 'report_id' ) } )
        .exec(function( err, response ){

          // error
          if ( err ) return res.negotiate( err );

          // format month
          response.forEach(function( d, i ){
            response[i].report_month = moment( response[i].reporting_period ).format( 'MMMM' );
          });

          // return csv
          json2csv({ data: response, fields: fields, fieldNames: fieldNames }, function( err, csv ) {
              
            // error
            if ( err ) return res.negotiate( err );

            // success
            return res.json( 200, { data: csv } );

          });

        });

    }

  },

  // get all reports by project id
  getReportsList: function( req, res ) {

    // request input
    if ( !req.param( 'filter' ) ) {
      return res.json( 401, { err: 'filter required!' });
    }
    
    // get project by organization_id & status
    Report
      .find( req.param( 'filter' ) )
      .sort( 'report_month ASC' )
      .exec ( function( err, reports ){
      
        // return error
        if ( err ) return res.negotiate( err );

        // counter
        var moment=require('moment'),
            counter=0,
            length=reports.length;

        // no reports
        if ( !length ) {
          return res.json( 200, reports );
        }

        // determine status
        if ( length )  {
    
          // reports
          reports.forEach( function( d, i ){

            // check if form has been edited
            Beneficiaries
              .count( { report_id: d.id } )
              .exec(function( err, b ){
                
                // return error
                if (err) return res.negotiate( err );

                // add status as green
                reports[i].status = '#4db6ac';
                reports[i].icon = 'watch_later';
                reports[i].status_title = 'Complete';

                // if no benficiaries and submitted
                if ( !b && reports[i].report_status === 'complete' ) {
                  // add status
                  reports[i].status = '#80cbc4';
                  reports[i].icon = 'adjust'
                  reports[i].status_title = 'Empty Submission';
                }

                // if report is 'todo' and past due date!
                if ( reports[i].report_status === 'todo' && moment().isAfter( moment( reports[i].reporting_due_date ) ) ) {
                        
                  // set to red (overdue!)
                  reports[i].status = '#e57373'
                  reports[i].icon = 'watch_later';
                  reports[i].status_title = 'Due';

                  // if beneficiaries ( report has been updated )
                  if ( b ) {
                    reports[i].status = '#fff176';
                    reports[i].status_title = 'Pending';
                  }

                }

                // reutrn
                counter++;
                if ( counter === length ) {
                  // table
                  return res.json( 200, reports );
                }

              });

          });

        }

      });

  },

  // get all Reports by project id
  getReportById: function( req, res ) {

    // request input
    if ( !req.param( 'id' ) ) {
      return res.json(401, { err: 'id required!' });
    }

    // report for UI
    var $report = {};    
    
    // get report by organization_id
    Report
      .findOne( { id: req.param( 'id' ) } )
      .exec( function( err, report ){
      
        // return error
        if (err) return res.negotiate( err );
        
        // clone project to update
        $report = report;

        // if no reports
        if ( !$report ) {
          return res.json( 200, [] );
        } 

        // get report by organization_id
        Location
          .find( { report_id: $report.id } )
          .exec( function( err, locations ){

            // return error
            if (err) return res.negotiate( err );

            // add locations ( associations included )
            $report.locations = locations;

            // if no reports
            if ( !$report.locations.length ) {
              return res.json( 200, $report );
            }

            // counter
            var counter = 0,
                length = $report.locations.length;

            // sort by location
            $report.locations.sort(function(a, b) {
              if ( a.facility_type_name ) {
                if( a.admin3name ) {
                  return a.admin1name.localeCompare(b.admin1name) || 
                          a.admin2name.localeCompare(b.admin2name) ||
                          a.admin3name.localeCompare(b.admin3name) ||
                          a.facility_type_name.localeCompare(b.facility_type_name) || 
                          a.facility_name.localeCompare(b.facility_name);
                } else {
                  return a.admin1name.localeCompare(b.admin1name) || 
                          a.admin2name.localeCompare(b.admin2name) ||
                          a.facility_type_name.localeCompare(b.facility_type_name) || 
                          a.facility_name.localeCompare(b.facility_name);
                }
              } else {
                if( a.admin3name ) {
                  return a.admin1name.localeCompare(b.admin1name) || 
                          a.admin2name.localeCompare(b.admin2name) ||
                          a.admin3name.localeCompare(b.admin3name) ||
                          a.facility_name.localeCompare(b.facility_name);
                } else {
                  return a.admin1name.localeCompare(b.admin1name) || 
                          a.admin2name.localeCompare(b.admin2name) ||
                          a.facility_name.localeCompare(b.facility_name);
                } 
              }
            });

            // for each location
            $report.locations.forEach( function( location, i ){

              // beneficiaries
              Beneficiaries
                .find( { location_id: location.id } )
                .exec( function( err, beneficiaries ){

                  // return error
                  if (err) return res.negotiate( err );

                  // add locations ( associations included )
                  $report.locations[i].beneficiaries = beneficiaries;

                  // sort by id
                  $report.locations[i].beneficiaries.sort( function( a, b ) {
                    return a.id.localeCompare( b.id );
                  });

                  // counter 
                  counter++;
                  if ( counter === length ) {
                    // return report
                    return res.json( 200, $report );
                  }

              });

            });

        });

      });  

  },

  // set report details by report id
  setReportById: function( req, res ) {

    // request input
    if ( !req.param( 'report' ) ) {
      return res.json(401, { err: 'report required!' });
    }
    
    // get report
    var $report = req.param( 'report' ),
        $locations = req.param( 'report' ).locations;

    // update report
    Report
      .update( { id: $report.id }, $report )
      .exec( function( err, report ){

        // return error
        if ( err ) return res.json({ err: true, error: err });

        // set updated
        $report = report[0];
        $report.locations = $locations;

        // counter
        var counter = 0,
            length = $report.locations.length;

        // sort by location
        $report.locations.sort(function(a, b) {
          if ( a.facility_type_name ) {
            if( a.admin3name ) {
              return a.admin1name.localeCompare(b.admin1name) || 
                      a.admin2name.localeCompare(b.admin2name) ||
                      a.admin3name.localeCompare(b.admin3name) ||
                      a.facility_type_name.localeCompare(b.facility_type_name) || 
                      a.facility_name.localeCompare(b.facility_name);
            } else {
              return a.admin1name.localeCompare(b.admin1name) || 
                      a.admin2name.localeCompare(b.admin2name) ||
                      a.facility_type_name.localeCompare(b.facility_type_name) || 
                      a.facility_name.localeCompare(b.facility_name);
            }
          } else {
            if( a.admin3name ) {
              return a.admin1name.localeCompare(b.admin1name) || 
                      a.admin2name.localeCompare(b.admin2name) ||
                      a.admin3name.localeCompare(b.admin3name) ||
                      a.facility_name.localeCompare(b.facility_name);
            } else {
              return a.admin1name.localeCompare(b.admin1name) || 
                      a.admin2name.localeCompare(b.admin2name) ||
                      a.facility_name.localeCompare(b.facility_name);
            } 
          }
        });

        // for each location
        $report.locations.forEach( function( location, i ){

          // beneficiaries
          Beneficiaries
            .updateOrCreateEach( { location_id: location.id }, location.beneficiaries, function( err, beneficiaries ){

              // return error
              if (err) return res.negotiate( err );

              // add locations ( associations included )
              $report.locations[i].beneficiaries = beneficiaries;

              // sort by id
              $report.locations[i].beneficiaries.sort( function( a, b ) {
                return a.id.localeCompare( b.id );
              });

              // counter 
              counter++;
              if ( counter === length ) {
                // return report
                return res.json( 200, $report );
              }

          });

        });

    });

  },

  // remove
  removeBeneficiary: function( req, res ){
    
    // request input
    if ( !req.param( 'id' ) ) {
      return res.json(401, { err: 'id required!' });
    }
    
    // get report
    var $id = req.param( 'id' );

    // location_reference_id 're-links' association after any updates 
       // when updating target locations in project details (this affects monthly report)
    Beneficiaries
      .update({ id: $id }, { location_id: null })
      .exec(function( err, b ){

        // return error
        if ( err ) return res.json({ err: true, error: err });           

        // return reports
        return res.json( 200, { msg: 'success' } );

      });

  }

};

