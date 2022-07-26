const logger = require('./logger.helper');

class Pagination {
  async generatePagination(model, queryParams, project = {}, statusQuery) {
    try {
      const paginationQueryObj = await Pagination.createPaginationQuery(
        queryParams,
        project,
        statusQuery,
      );
      const countAggregateOptions = [
        {
          $count: 'totalRecords',
        },
      ];
      if (
        paginationQueryObj &&
        Object.keys(paginationQueryObj.matchQuery).length
      ) {
        countAggregateOptions.splice(0, 0, paginationQueryObj.matchQuery);
      }
      const countAggregate = await model.aggregate(countAggregateOptions);
      const totalRecords = countAggregate.length
        ? countAggregate[0].totalRecords
        : 0;
      const pageCount = Math.ceil(totalRecords / paginationQueryObj.limit) || 1;
      const rawData = await model.aggregate(paginationQueryObj.aggregateQuery);

      const finalData = {
        docs: rawData,
        limit: paginationQueryObj.limit,
        total: totalRecords,
        page: paginationQueryObj.page,
        pages: pageCount,
      };
      return finalData;
    } catch (error) {
      logger.error('From pagination function error', { errorMsg: error });
      return {
        success: false,
        statusCode: 500,
        msg: 'An error occurs',
      };
    }
  }

  static async createPaginationQuery(queryParams, project, statusQuery) {
    const aggregateData = [];
    let page = 1;
    let limitNum = 0;
    let status = { status: 'active' };
    if (statusQuery) {
      status = statusQuery;
    }
    const match = {
      $match: {
        $and: [status],
      },
    };
    let limit = {};
    const sort = {};
    let skip = {};
    if (queryParams) {
      for (const key in queryParams) {
        switch (key) {
          case 'sortKey': {
            const sortArray = queryParams[key].split(',');
            const sortDirArray = queryParams['sortDirection'].split(',');
            if (sortArray && sortArray.length) {
              sortArray.forEach((element, i) => {
                const orderBy =
                  sortDirArray && sortDirArray.length && sortDirArray[i]
                    ? sortDirArray[i] === 'asc'
                      ? 1
                      : -1
                    : 1;
                if (sort['$sort']) {
                  sort['$sort'][element] = orderBy;
                } else {
                  sort['$sort'] = {
                    [element]: orderBy,
                  };
                }
              });
            }
            break;
          }
          case 'sortDirection': {
            break;
          }
          case 'limit': {
            if (parseInt(queryParams['limit'])) {
              limit = {
                $limit: parseInt(queryParams['limit']),
              };
              limitNum = parseInt(queryParams['limit']);
            }
            break;
          }
          case 'page': {
            page = parseInt(queryParams['page']);
            const skipNum = parseInt(queryParams['limit'])
              ? (page - 1) * parseInt(queryParams['limit'])
              : 0;
            skip = {
              $skip: skipNum,
            };
            break;
          }
          default: {
            if (
              match['$match'] &&
              match['$match']['$and'] &&
              match['$match']['$and'].length
            ) {
              match['$match']['$and'].push({
                [key]: new RegExp(queryParams[key], 'gi'),
              });
            } else {
              match['$match'] = {
                $and: [{ [key]: new RegExp(queryParams[key], 'gi') }, status],
              };
            }
            break;
          }
        }
      }

      if (Object.keys(match).length) {
        aggregateData.push(match);
      }
      if (Object.keys(project).length) {
        aggregateData.push({
          $project: project,
        });
      }
      if (Object.keys(skip).length) {
        aggregateData.push(skip);
      }
      if (Object.keys(limit).length) {
        aggregateData.push(limit);
      }
      if (Object.keys(sort).length) {
        aggregateData.push(sort);
      }
    }
    return {
      aggregateQuery: aggregateData,
      matchQuery: match,
      limit: limitNum,
      page: page,
    };
  }
}

module.exports = Pagination;
