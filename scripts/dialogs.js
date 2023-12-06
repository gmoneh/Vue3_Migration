var LSI = LSI || {};
LSI.IPP = LSI.IPP || {};
LSI.IPP.Common = LSI.IPP.Common || {};
LSI.IPP.Common.Dialogs = LSI.IPP.Common.Dialogs || [];

LSI.IPP.Common.EditDialog = function ($dialog, container, showImmediately) {
    var $this = this;
    var $saveButton = $('button[data-save=true]', $dialog);
    var $form = $('form', $dialog);
    var myContainer = container;
    init();

    function init() {
        bindHandlers();
        if (showImmediately) {
            $dialog.modal();
        }
    }

    function initForm() {
        var onSuccess = $form.attr('data-ajax-success');
        var onFailure = $form.attr('data-ajax-failure');
        if (!onSuccess) {
            $form.attr('data-ajax-success', 'LSI.IPP.Common.Dialogs.' + myContainer + '.onSaveCompleted');
        }
        if (!onFailure) {
            $form.attr('data-ajax-failure', 'LSI.IPP.Common.Dialogs.' + myContainer + '.onSaveFailure');
        }
        $form.applyFormAspects();
        $saveButton.off("click").click(onSave);
        $form.bind('invalid-form', onValidationErrors);

        if (LSI.wireupButtonActions) {
            LSI.wireupButtonActions($dialog);
        }
    }

    function bindHandlers() {
        $dialog.on("show.bs.modal", onShow);
    }

    function onSave(event) {
        $saveButton.buttontext('loading');
        $form.submit();
    }

    function onShow() {
        var onShow = $dialog.attr('data-action-show');
        if (onShow) {
            $('.modal-body', $dialog).load($dialog.attr("data-action-show"),
                function () {
                    initForm();
                });
        } else {
            initForm();
        }
    }

    function onValidationErrors(evt) {
        $saveButton.buttontextreset();
    }

    this.dismiss = function () {
        $dialog.modal('hide');
        $saveButton.buttontextreset();
    }

    this.show = function () {
        $dialog.modal('show');
    }

    this.onSaveCompleted = function (data, textStatus, jqXHR) {
        // The results of the operation come in a header on the response
        var operationHeader = jqXHR.getResponseHeader('Action-Result');
        if (operationHeader == 'success') {
            saveOperationSuccess(data);
            LSI.IPP.Common.WireDialogButtons();
            if (LSI.wireupButtonActions) {
                LSI.wireupButtonActions();
            }
        }
        else {
            saveOperationError(data);
        }
    }

    this.onSaveFailure = function () {
        alert('An error has occurred processing your request; please try again or contact technical support for assistance');
    }

    function saveOperationSuccess(data) {
        $this.dismiss();
    }

    function saveOperationError(data) {
        $saveButton.buttontextreset();
        initForm();
    }
};

LSI.IPP.Common.WireDialogButtons = function () {
    $('button[data-dialog-container]').click(function () {
        var btn = $(this);
        var container = btn.attr('data-dialog-container');
        var url = btn.attr('data-dialog-url');
        if (url) {
            btn.buttontext('loading');
            $.get(url, function (data) {
                $(container).html(data);
                LSI.IPP.Common.Dialogs[container] = new LSI.IPP.Common.EditDialog($(container).find("div.modal"), container, true);
                btn.buttontextreset();
            }).fail(function () {
                alert('An error as occurred processing your request; please try again or contact technical support');
                btn.buttontextreset();
            });
        }
        return false;
    });
};

$(function () {
    LSI.IPP.Common.WireDialogButtons();
});
