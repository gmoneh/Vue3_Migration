var LSI = LSI || {};
LSI.IPP = LSI.IPP || {};
LSI.IPP.FAQs = LSI.IPP.FAQs || {};

LSI.Application = LSI.Application || {};
LSI.Application.appRoot = "";
LSI.Application.appRootPlaceholder = "~";

LSI.Application.mapPath = function (path) {
    return path.replace(LSI.Application.appRootPlaceholder, LSI.Application.appRoot);
};


(function ($) {
    $(document).ajaxError(function (event, jqXHR, settings, error) {
        if (jqXHR.status == 401) {
            // When an Ajax request returns Not Authorized, we'll redirect the whole page
            // to the Portal
            window.location.href = LSI.Application.appRoot;
            alert("Your session has timed out due to inactivity. Please login again.");
        }
    });
})(jQuery);


function handleCollapseBurger() {
    $(document).on('click', '#collapse-burger', function () {
        $sidemenu = $('nav.side-menu');
        let compact = !$sidemenu.hasClass('compact');
        // if (App.stackedMenu) App.stackedMenu.compact(compact);
        $sidemenu.toggleClass('compact');
        $('.app-aside').toggleClass('app-aside-compact');
        $('.app-main').toggleClass('app-main-compact');
        $.post("/UserPreferences/COMPACTMENU", { value: compact });
    });
}


function handleExpandingCollapsedMenu() {
    $('aside .aside-menu').click(function (event) {
        if (!$aside.hasClass('app-aside-compact')) return;
        openAside();
        event.preventDefault();
    });
    $('aside .aside-menu').hover(openAside, closeAside);

    function openAside() {
        $sidemenu = $('nav.side-menu');
        $aside = $('aside');
        if (!$aside.hasClass('app-aside-compact')) return;
        $sidemenu.toggleClass('compact');
        $aside.removeClass('app-aside-compact');
        $aside.addClass('app-aside-open');
    }

    function closeAside() {
        $sidemenu = $('nav.side-menu');
        $aside = $('aside');
        if (!$aside.hasClass('app-aside-open')) return;
        $sidemenu.toggleClass('compact');
        $aside.removeClass('app-aside-open');
        $aside.addClass('app-aside-compact');
    }
}


$(document).ready(function () {
    handleCollapseBurger();
    handleExpandingCollapsedMenu();
});
