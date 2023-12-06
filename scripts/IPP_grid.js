/*
Data Grid
*/

var LSI = LSI || {};
LSI.UI = LSI.UI || {};
LSI.UI.Grid = LSI.UI.Grid || {};

LSI.UI.Grid.applyGridAspects = function (index, elem) {
    var grid = $(elem);
    elem.gridAspects = new gridAspects(grid);
    elem.gridAspects.generatePager();
    elem.gridAspects.bindSortingHeaders();

    function gridAspects(jqgrid) {
        this.grid = jqgrid;

        this.generatePager = function () {
            // First, delete the existing pager if any
            grid.prevAll('.pagination-container').remove();
            var Pager = new LSI.UI.Grid.Pager(this.grid);
            var jqPager = Pager.generate();
            grid.before(jqPager);
        }

        this.refresh = function (formData) {
            if ($.fn.spin && LSI.pagerSpinnerOpts) {
                $('nav.pagination-container').find('div').spin(LSI.pagerSpinnerOpts).find("ul").css({ opacity: 0.2 });
            }
            this.grid.trigger("gridRefreshing");
            var refreshUrl = this.grid.attr("data-refresh-action");
            var data = $.extend(this.pagingData, formData);
            $.get(refreshUrl, data, onRefreshSuccess, 'html');
        }

        this.bindSortingHeaders = function () {
            grid.find('a[data-sort-expr]').each(function () {
                var lnkHeader = $(this);
                var sortexpr = lnkHeader.attr('data-sort-expr');
                lnkHeader.click({ sortExpression: sortexpr }, sortingHeaderClickHandler);
            });
        }

        this.pagingData = { $top: this.grid.attr("data-paging-top"), $skip: this.grid.attr("data-paging-skip"), $orderby: this.grid.attr("data-order-by"), $filter: this.grid.attr("data-filter") }

        function sortingHeaderClickHandler(evt) {
            var orderby = evt.data.sortExpression;
            elem.gridAspects.refresh({ $orderby: orderby });
            return false;
        }

        function onRefreshSuccess(data, textStatus, jqXHR) {
            var newgrid = $(data);
            // Must insert the new data in place of the old one
            grid.replaceWith(newgrid);
            // At the end, attach the aspects
            newgrid.children().addBack().filter('*[data-refresh-action]').each(LSI.UI.Grid.applyGridAspects);

            newgrid.trigger("gridRefreshed");
        }
    }
};


LSI.UI.Grid.Pager = function (forGrid) {
    this.generate = function () {
        var paginationEnabled = forGrid.attr("data-paging-enabled");
        if (paginationEnabled != "true") return null;   // Pagination explicitly disabled
        var refreshAction = forGrid.attr("data-refresh-action");
        if (refreshAction == null) return null;  // No point in having a pager if we don't know how to refresh the grid
        var pagingInfo = new PagingInfo(forGrid);
        // Now generate a new one with the new parameters
        if (pagingInfo.maxpages <= 0) return;  // No pager needed if only one page!
        var jqPager = $('<nav class="pagination-container"><ul class="pagination pagination-sm  justify-content-end"></ul></div>');
        var jqPagerList = jqPager.find("ul");
        jqPagerList.append('<li class="page-item disabled"><span class="page-link">Page ' + pagingInfo.curpage + ' of ' + pagingInfo.maxpages + '</span></li>');
        if (pagingInfo.maxpages > 1) {
            if (pagingInfo.curpage > 1) jqPagerList.append(pagerItem('prev', '&laquo;', skipToPage(pagingInfo.curpage - 1)));
            var pageStart = 1;
            var pageEnd = pagingInfo.maxpages;
            if (pagingInfo.maxpages > 2) {
                pageStart = pagingInfo.curpage - 2;
                pageEnd = pagingInfo.curpage + 2;
                if (pageStart <= 0) {
                    pageEnd -= pageStart;
                    pageStart = 1;
                }
                if (pageEnd > pagingInfo.maxpages) {
                    pageEnd = pagingInfo.maxpages;
                }
            }
            if (pageStart > 1) jqPagerList.append(pagerItem(1));
            for (var i = pageStart; i <= pageEnd; i++) {
                jqPagerList.append(pagerItem(i));
            }
            if (pageEnd < pagingInfo.maxpages) jqPagerList.append(pagerItem(pagingInfo.maxpages));
            if (pagingInfo.curpage < pagingInfo.maxpages) jqPagerList.append(pagerItem('next', '&raquo;', skipToPage(pagingInfo.curpage + 1)));
        }
        // Now special styles
        if (pagingInfo.curpage == 1) jqPagerList.find('li#pager_prev').addClass('disabled');
        if (pagingInfo.curpage == pagingInfo.maxpages) jqPagerList.find('li#pager_next').addClass('disabled');
        bindHandlers(jqPager);
        return jqPager;

        function skipToPage(page) {
            return (page - 1) * pagingInfo.ipp;
        }

        function pagerItem(id, text, skip) {
            if (text == undefined) text = id;
            if (skip == undefined) skip = skipToPage(id);
            var innerTag = 'a';
            var innerattr = 'data-paging-skip=\'' + skip + '\' ';
            var innerclass = 'page-link';
            var aclass = 'page-item';
            if (id == pagingInfo.curpage) {
                innerTag = 'span';
                innerattr = '';
                aclass = aclass + ' active';
            }
            return '<li id=\'pager_' + id + '\' class=\'' + aclass + '\'><' + innerTag + ' class=\'' + innerclass + '\' ' + innerattr + '>' + text + '</' + innerTag + '></li>';
        }
    }

    function bindHandlers(jqPager) {
        jqPager.find('a').each(function () {
            jqlink = $(this);
            var skip = jqlink.attr("data-paging-skip");
            jqlink.click({ skip: skip }, pagerClickHandler);
        })
    }

    function pagerClickHandler(evt) {
        forGrid.get(0).gridAspects.refresh({ $skip: evt.data.skip });
        return false;
    }

    function PagingInfo(grid) {
        this.maxitems = grid.attr("data-paging-max");
        this.cur = grid.attr("data-paging-skip");
        this.ipp = grid.attr("data-paging-top");
        this.maxpages = Math.ceil(this.maxitems / this.ipp);
        this.curpage = Math.ceil(this.cur / this.ipp) + 1;
        return this;
    }
};


function applyGridAspects(context) {
    if (typeof context != "object" || context.jquery == undefined) context = undefined;
    $('*[data-refresh-action]', context).each(LSI.UI.Grid.applyGridAspects)
}


/* JQuery Plugin */
(function ($) {
    $.fn.ipp_grid = function (options) {
        var $grids = this.find('*[data-refresh-action]').addBack('*[data-refresh-action]');
        var what = null;
        if (typeof options == "string") {
            switch (options) {
                case "refresh":
                    {
                        what = refresh;
                        break;
                    }
            }
        }
        else {
            what = install;
        }
        return $grids.each(what);

        function refresh(index, elem) {
            if (elem.gridAspects != null) {
                elem.gridAspects.refresh();
            }
        }

        function install(index, elem) {
            LSI.UI.Grid.applyGridAspects(index, elem);
        }
    }

    $(document).ready(applyGridAspects);
})(jQuery);
