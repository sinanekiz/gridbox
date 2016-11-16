if (!jQuery) { throw new Error("simpler requires jQuery.js") }
if (!$.bootstrapGrowl) { throw new Error("simpler.notification requires bootstrapGrowl.js") }

var simpler = {
    ajax: {
        post: function (url, data, success, error) {
            $.post(url, data).done(success || simpler.notification.default).fail(error || simpler.error).always();
        },
        get: function (url, success, error) {
            $.ajax({
                url: url,
                cache: false,
                contentType: false,
                processData: false,
                type: 'get',
                success: success || simpler.notification.default,
                error: error || simpler.error
            });
        }
    }
    , notification: {
        success: function (message) {
            $.bootstrapGrowl(message, { ele: "body", type: "success", offset: { from: "bottom", amount: 20 }, align: "Right" });
        },
        error: function (message) {
            $.bootstrapGrowl(message, { ele: "body", type: "danger", offset: { from: "bottom", amount: 20 }, align: "Right" });
        },
        default: function (response) {
            $("#editFormWaiting").modal('hide');

            if (response.status) {
                simpler.notification.success(response.message);
            } else if (!response.status) {
                simpler.notification.error(response.message);
            } else {
                simpler.notification.success("İşlem başarıyla tamamlandı");
            }
        }
    }
    , error: function (error) {
        alert("İnternet Bağlantınızı Kontrol edin");
        console.log(error);
    }
    , selectList: {
        pushList: function (list, selectedId, inputId) {
            $(inputId).empty();
            $(inputId).append(list);
            $(inputId).val(selectedId);
        },
        createSelectDom: function (data, selectedId, inputId) {
            var list = "<option value=''>Seçiniz</option>";
            for (var index = 0; index < data.length; index++) {
                list += "<option value='" + data[index].Id + "' text='" + data[index].Name.turkishToUpper() + "' >" + data[index].Name + "</option>";
            }
            if (selectedId == 0) { selectedId = ""; }

            simpler.selectList.pushList(list, selectedId, inputId);

        },
        listenList: function (data) {
            if (!data) { return; }
            var domElement = $(data.domId);
            var newData = data.subList;
            domElement.bind('input', function (e, callback) {
                if (!newData) { return; }
                simpler.ajax.get(newData.url + domElement.val(), function (response) {
                    simpler.selectList.createSelectDom(response.value, newData.selectedId, newData.domId);
                    callback ? callback() : null;
                }, function () { });
            });
            simpler.selectList.listenList(newData);
            //$(domElement).change();

        },
        createLists: function (data) {
            simpler.ajax.get(data.url, function (response) {
                simpler.selectList.createSelectDom(response.value, data.selectedId, data.domId);
                simpler.selectList.listenList(data);
            });
        }
    },
    datatable: {
        allTables: [],
        reload: function () {
            simpler.datatable.allTables.filter(function (table) {
                table.ajax.reload();
            });
        },
        create: function (datatables, crud) {
            datatables.filter(function (table) {
                $("#datatables").append("<table id='" + table.name + "'  style='width:100%'>")
                var datatable = $('#' + table.name).DataTable(table);
                simpler.datatable.allTables.push(datatable);
                simpler.datatable.tools(datatable);
                simpler.datatable.events.addAll('#' + table.name, datatable, crud);
            })
        },
        tools: function (datatable) {
            $(".tool-action").on("click", function () {
                var e = $(this).attr("data-action");
                datatable.button(e).trigger()
            })
        },
        form: {
            reCreate: function (form) {
                $("#form-content").empty();
                $("#form-content").append(form);
            }
        },
        crud: {
            config: {},
            create: function (datatable) {

            },
            read: function (data) {
                simpler.datatable.width.setSmall();
                simpler.ajax.get(simpler.datatable.crud.config.read + data._id, simpler.datatable.form.reCreate);
            },
            update: function () {
                var url = $("#ajax-form").attr("action");
                var obj = $("#ajax-form").serializeObject();
                simpler.ajax.post(url, obj, function (result) {
                    simpler.datatable.form.reCreate(result);
                    simpler.datatable.reload();
                });
            },
            delete: function (url) {
                $.ajax({
                    url: url, type: 'DELETE', error: function (result) {
                        simpler.datatable.reload();
                    }
                });
            }

        },
        width: {
            setFull: function () {
                $("#datatables-portlet").attr("class", "col-md-12");
                $(window).resize()
                $("#form-content").empty();

            },
            setSmall: function () {
                $("#datatables-portlet").attr("class", "col-md-5");
                $(window).resize()
            },
            setHidden: function () { }
        },
        events: {
            addAll: function (id, datatable, crud) {
                simpler.datatable.crud.config = crud;
                simpler.datatable.events.click(id, datatable);
            },
            click: function (datatableId, datatable) {
                $(datatableId + ' tbody').on('click', 'tr', function () {
                    if ($(this).hasClass('selected')) {
                        $(this).removeClass('selected');
                        simpler.datatable.width.setFull();
                    }
                    else {
                        datatable.$('tr.selected').removeClass('selected');
                        $(this).addClass('selected');
                        var data = datatable.row(this).data();
                        simpler.datatable.crud.read(data);
                    }

                });
            }
        }
    }

}

//Other Congfigurations

String.prototype.turkishToUpper = function () {
    var string = this;
    var letters = { "i": "İ", "ş": "Ş", "ğ": "Ğ", "ü": "Ü", "ö": "Ö", "ç": "Ç", "ı": "I" };
    string = string.replace(/(([iışğüçö]))+/g, function (letter) { return letters[letter]; });
    return string.toUpperCase();
}


$.fn.serializeObject = function () {

    var self = this,
        json = {},
        push_counters = {},
        patterns = {
            "validate": /^[a-zA-Z][a-zA-Z0-9_]*(?:\[(?:\d*|[a-zA-Z0-9_]+)\])*$/,
            "key": /[a-zA-Z0-9_]+|(?=\[\])/g,
            "push": /^$/,
            "fixed": /^\d+$/,
            "named": /^[a-zA-Z0-9_]+$/
        };


    this.build = function (base, key, value) {
        base[key] = value;
        return base;
    };

    this.push_counter = function (key) {
        if (push_counters[key] === undefined) {
            push_counters[key] = 0;
        }
        return push_counters[key]++;
    };

    $.each($(this).serializeArray(), function () {

        // skip invalid keys
        //if (!patterns.validate.test(this.name)) {
        //    return;
        //}

        var k,
            keys = this.name.match(patterns.key),
            merge = this.value,
            reverse_key = this.name;
        var input = $("input[name='" + reverse_key + "']");
        if (input.prop("checked")) {
            merge = true;
        }
        var split = reverse_key.split(".");
        reverse_key = split[0];
        for (var i = 1; i < split.length; i++) {
            if (split[i].indexOf("[") != -1 && split[i].indexOf("]") != -1) {
                reverse_key += split[i];
                continue;
            }
            reverse_key += "[" + split[i] + "]";
        }

        while ((k = keys.pop()) !== undefined) {

            // adjust reverse_key
            reverse_key = reverse_key.replace(new RegExp("\\[" + k + "\\]$"), '');

            // push
            if (k.match(patterns.push)) {
                merge = self.build([], self.push_counter(reverse_key), merge);
            }

            // fixed
            else if (k.match(patterns.fixed)) {
                merge = self.build([], k, merge);
            }

            // named
            else if (k.match(patterns.named)) {
                merge = self.build({}, k, merge);
            }
        }

        json = $.extend(true, json, merge);
    });


    return json;
};