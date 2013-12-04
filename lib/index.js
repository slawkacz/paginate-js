var defaults = function (a, b) {
  for (var i in b) {
    if (a[i] === undefined) {
      a[i] = b[i];
    }
  }
};

module.exports = function (options) {
  var PAGINATE = {};

  options = options || {};
  PAGINATE.options = defaults(options, {
    elements_per_page: 100,
    window_size: 6
  });

  if (options.count_elements === undefined) {
    throw Error('You must provide a number of elements');
  }

  PAGINATE.count_pages = Math.ceil(options.count_elements / options.elements_per_page) || 1;
  PAGINATE.window_size = options.window_size;

  PAGINATE.prepare = function (options) {
    var first, middle_start, last, middle_end;

    options = options || {};
    defaults(options, {page: 1});

    // if current page is in the first window
    if (options.page <= PAGINATE.window_size) {

      first = false;
      middle_start = 1;

      if (PAGINATE.count_pages <= PAGINATE.window_size + 3) {
        last = false;
        middle_end = PAGINATE.count_pages;
      } else {
        last = true;
        middle_end = PAGINATE.window_size + 1;
      }

      // if its in the last window
    } else if (options.page > PAGINATE.count_pages - PAGINATE.window_size) {

      last = false;
      middle_end = PAGINATE.count_pages;

      if (PAGINATE.count_pages <= PAGINATE.window_size + 3) {
        first = false;
        middle_start = 2;
      } else {
        first = true;
        middle_start = PAGINATE.count_pages - PAGINATE.window_size;
      }

    } else {
      first = true;
      last = true;
      middle_start = options.page - 1;
      middle_end = options.page + 1;
    }

    return {
      first: first,
      last: last,
      middle_start: middle_start,
      middle_end: middle_end
    };
  };

  PAGINATE.render = function (options) {
    var html = '',
      pos = {}, i;

    options = options || {};
    defaults(options, {
      page: 1,
      div_class: 'paginator',
      nextprev_class: 'nextprev',
      current_class: 'current',
      next_text: 'Next »',
      previous_text: '« Previous'
    });

    if (!options.url) {
      throw Error('You must provide a url');
    }

    options.page = parseInt(options.page, 10);

    pos = PAGINATE.prepare(options);

    if (PAGINATE.count_pages > 1) {
      html += "<ul class='" + options.div_class + "'>";

      // PREV
      if (options.page === 1) {
        html += "<li><span class='" + options.nextprev_class + "'>" + options.previous_text + "</span></li>";
      } else {
        html += "<li><a class='" + options.nextprev_class + "' href='" +
          options.url.replace(/%N/, options.page - 1) + "'>" + options.previous_text + "</a></li>";
      }

      //FIRST
      if (pos.first) {
        html += "<li><a href='" + options.url.replace(/%N/, 1) + "'>1</a></li>";
        html += "<li><a href='" + options.url.replace(/%N/, 2) + "'>2</a></li>";
        html += "<li><span>...</span></li>";
      }

      // MIDDLE
      for (i = pos.middle_start; i <= pos.middle_end; i += 1) {
        if (i === options.page) {
          html += "<li><span class='" + options.current_class + "'>" + i + "</span></li>";
        } else {
          html += "<li><a href='" + options.url.replace(/%N/, i) + "'>" + i + "</a></li>";
        }
      }

      // LAST
      if (pos.last) {
        html += "<li><span>...</span></li>";
        html += "<li><a href='" + options.url.replace(/%N/, PAGINATE.count_pages - 1) +
          "'>" + (PAGINATE.count_pages - 1) + "</a></li>";
        html += "<li><a href='" + options.url.replace(/%N/, PAGINATE.count_pages) +
          "'>" + PAGINATE.count_pages + "</a></li>";
      }

      // NEXT
      if (options.page === PAGINATE.count_pages) {
        html += "<li><span class='" + options.nextprev_class + "'>" + options.next_text + "</span></li>";
      } else {
        html += "<li><a class='" + options.nextprev_class + "' href='" + options.url.replace(/%N/, options.page + 1) +
          "'>" + options.next_text + "</a></li>";
      }

      html += "</ul>";
    }

    return html;
  }

  return PAGINATE;
};
