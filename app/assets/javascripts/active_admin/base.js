/**
 * Warning: This file is auto-generated, do not modify. Instead, make your changes in 'app/javascript/active_admin/' and run `yarn build`
 */
//= require jquery3
//= require jquery-ui/widgets/datepicker
//= require jquery-ui/widgets/dialog
//= require jquery-ui/widgets/sortable
//= require jquery-ui/widgets/tabs
//= require jquery-ui/widget
//= require jquery_ujs
//= require_self

(function(factory) {
  typeof define === "function" && define.amd ? define([ "jquery", "jquery-ui/ui/widgets/datepicker", "jquery-ui/ui/widgets/dialog", "jquery-ui/ui/widgets/sortable", "jquery-ui/ui/widgets/tabs", "jquery-ui/ui/widget", "jquery-ujs" ], factory) : factory();
})(function() {
  "use strict";
  $.fn.serializeObject = function() {
    return this.serializeArray().reduce(function(obj, item) {
      obj[item.name] = item.value;
      return obj;
    }, {});
  };
  $.ui.dialog.prototype._focusTabbable = function() {
    this.uiDialog.focus();
  };
  function ModalDialog(message, inputs, callback) {
    var html = '<form id="dialog_confirm" title="' + message + '"><ul>';
    for (var name in inputs) {
      var elem, opts, wrapper;
      var type = inputs[name];
      if (/^(datepicker|checkbox|text|number)$/.test(type)) {
        wrapper = "input";
      } else if (type === "textarea") {
        wrapper = "textarea";
      } else if ($.isArray(type)) {
        var _ref = [ "select", "option", type, "" ];
        wrapper = _ref[0];
        elem = _ref[1];
        opts = _ref[2];
        type = _ref[3];
      } else {
        throw new Error("Unsupported input type: {" + name + ": " + type + "}");
      }
      var klass = type === "datepicker" ? type : "";
      html += "<li>\n      <label>" + (name.charAt(0).toUpperCase() + name.slice(1)) + "</label>\n      <" + wrapper + ' name="' + name + '" class="' + klass + '" type="' + type + '">' + (opts ? function() {
        var result = [];
        opts.forEach(function(v) {
          var $elem = $("<" + elem + "/>");
          if ($.isArray(v)) {
            $elem.text(v[0]).val(v[1]);
          } else {
            $elem.text(v);
          }
          result.push($elem.wrap("<div>").parent().html());
        });
        return result;
      }().join("") : "") + ("</" + wrapper + ">") + "</li>";
      var _ref2 = [];
      wrapper = _ref2[0];
      elem = _ref2[1];
      opts = _ref2[2];
      type = _ref2[3];
      klass = _ref2[4];
    }
    html += "</ul></form>";
    var form = $(html).appendTo("body");
    $("body").trigger("modal_dialog:before_open", [ form ]);
    form.dialog({
      modal: true,
      open: function open(event, ui) {
        $("body").trigger("modal_dialog:after_open", [ form ]);
      },
      dialogClass: "active_admin_dialog",
      buttons: {
        OK: function OK() {
          callback($(this).serializeObject());
          $(this).dialog("close");
        },
        Cancel: function Cancel() {
          $(this).dialog("close").remove();
        }
      }
    });
  }
  var BatchActions = function() {
    function BatchActions(options, element) {
      this.element = element;
      this.$element = $(this.element);
      this.$batchActionsSelector = this.$element.find(".batch_actions_selector");
      this.$batchActionInputs = this.$element.find("#batch_action_inputs");
      this.$batchAction = this.$element.find("#batch_action");
      this.$paginatedCollection = this.$element.find(".paginated_collection");
      this._init();
      this._bind();
    }
    var _proto = BatchActions.prototype;
    _proto.option = function option(key, value) {};
    _proto._init = function _init() {
      var _this = this;
      this.$batchActionsSelector.find("li a").off("click confirm:complete");
      this.$batchActionsSelector.find("li a").on("click", function(event) {
        var message;
        event.stopPropagation();
        event.preventDefault();
        if (message = $(event.target).data("confirm")) {
          ModalDialog(message, $(event.target).data("inputs"), function(inputs) {
            $(event.target).trigger("confirm:complete", inputs);
          });
        } else {
          $(event.target).trigger("confirm:complete");
        }
      });
      this.$element.find("li a").on("confirm:complete", function(event, inputs) {
        var val;
        if (val = JSON.stringify(inputs)) {
          _this.$batchActionInputs.removeAttr("disabled").val(val);
        } else {
          _this.$batchActionInputs.attr("disabled", "disabled");
        }
        _this.$batchAction.val($(event.target).data("action"));
        $("#collection_selection").submit();
      });
    };
    _proto._bind = function _bind() {
      var _this2 = this;
      if (this.$batchActionsSelector.length && $(":checkbox.toggle_all").length) {
        if (this.$paginatedCollection.find("table.index_table").length) {
          this.$paginatedCollection.find("table.index_table").tableCheckboxToggler();
        } else {
          this.$paginatedCollection.checkboxToggler();
        }
        $(document).on("change", this.$paginatedCollection.find(":checkbox"), function(event) {
          if (_this2.$paginatedCollection.find(":checkbox:checked").length && $(".dropdown_menu_list").children().length) {
            _this2.$batchActionsSelector.each(function() {
              $(this).aaDropdownMenu("enable");
            });
          } else {
            _this2.$batchActionsSelector.each(function() {
              $(this).aaDropdownMenu("disable");
            });
          }
        });
      }
    };
    return BatchActions;
  }();
  var CheckboxToggler = function() {
    function CheckboxToggler(options, container) {
      this.options = options;
      this.container = container;
      this._init();
      this._bind();
    }
    var _proto = CheckboxToggler.prototype;
    _proto.option = function option(key, value) {};
    _proto._init = function _init() {
      if (!this.container) {
        throw new Error("Container element not found");
      } else {
        this.$container = $(this.container);
      }
      if (!this.$container.find(".toggle_all").length) {
        throw new Error('"toggle all" checkbox not found');
      } else {
        this.toggle_all_checkbox = this.$container.find(".toggle_all");
      }
      this.checkboxes = this.$container.find(":checkbox").not(this.toggle_all_checkbox);
    };
    _proto._bind = function _bind() {
      var _this = this;
      this.checkboxes.change(function(event) {
        return _this._didChangeCheckbox(event.target);
      });
      this.toggle_all_checkbox.change(function() {
        return _this._didChangeToggleAllCheckbox();
      });
    };
    _proto._didChangeCheckbox = function _didChangeCheckbox(checkbox) {
      var numChecked = this.checkboxes.filter(":checked").length;
      var allChecked = numChecked === this.checkboxes.length;
      var someChecked = numChecked > 0 && numChecked < this.checkboxes.length;
      this.toggle_all_checkbox.prop({
        checked: allChecked,
        indeterminate: someChecked
      });
    };
    _proto._didChangeToggleAllCheckbox = function _didChangeToggleAllCheckbox() {
      var setting = this.toggle_all_checkbox.prop("checked");
      this.checkboxes.prop({
        checked: setting
      });
      return setting;
    };
    return CheckboxToggler;
  }();
  var DropdownMenu = function() {
    function DropdownMenu(options, element) {
      this.options = options;
      this.element = element;
      this.$element = $(this.element);
      var defaults = {
        fadeInDuration: 20,
        fadeOutDuration: 100,
        onClickActionItemCallback: null
      };
      this.options = $.extend(defaults, this.options);
      this.isOpen = false;
      this.$menuButton = this.$element.find(".dropdown_menu_button");
      this.$menuList = this.$element.find(".dropdown_menu_list_wrapper");
      this._buildMenuList();
      this._bind();
    }
    var _proto = DropdownMenu.prototype;
    _proto.open = function open() {
      this.isOpen = true;
      this.$menuList.fadeIn(this.options.fadeInDuration);
      this._position();
      return this;
    };
    _proto.close = function close() {
      this.isOpen = false;
      this.$menuList.fadeOut(this.options.fadeOutDuration);
      return this;
    };
    _proto.destroy = function destroy() {
      this.$element = null;
      return this;
    };
    _proto.isDisabled = function isDisabled() {
      return this.$menuButton.hasClass("disabled");
    };
    _proto.disable = function disable() {
      this.$menuButton.addClass("disabled");
    };
    _proto.enable = function enable() {
      this.$menuButton.removeClass("disabled");
    };
    _proto.option = function option(key, value) {
      if ($.isPlainObject(key)) {
        return this.options = $.extend(true, this.options, key);
      } else if (key != null) {
        return this.options[key];
      } else {
        return this.options[key] = value;
      }
    };
    _proto._buildMenuList = function _buildMenuList() {
      this.$nipple = $('<div class="dropdown_menu_nipple"></div>');
      this.$menuList.prepend(this.$nipple);
      this.$menuList.hide();
    };
    _proto._bind = function _bind() {
      var _this = this;
      $("body").click(function() {
        if (_this.isOpen) {
          _this.close();
        }
      });
      this.$menuButton.click(function() {
        if (!_this.isDisabled()) {
          if (_this.isOpen) {
            _this.close();
          } else {
            _this.open();
          }
        }
        return false;
      });
    };
    _proto._position = function _position() {
      this.$menuList.css("top", this.$menuButton.position().top + this.$menuButton.outerHeight() + 10);
      var button_left = this.$menuButton.position().left;
      var button_center = this.$menuButton.outerWidth() / 2;
      var button_right = button_left + button_center * 2;
      var menu_center = this.$menuList.outerWidth() / 2;
      var nipple_center = this.$nipple.outerWidth() / 2;
      var window_right = $(window).width();
      var centered_menu_left = button_left + button_center - menu_center;
      var centered_menu_right = button_left + button_center + menu_center;
      if (centered_menu_left < 0) {
        this.$menuList.css("left", button_left);
        this.$nipple.css("left", button_center - nipple_center);
      } else if (centered_menu_right > window_right) {
        this.$menuList.css("right", window_right - button_right);
        this.$nipple.css("right", button_center - nipple_center);
      } else {
        this.$menuList.css("left", centered_menu_left);
        this.$nipple.css("left", menu_center - nipple_center);
      }
    };
    return DropdownMenu;
  }();
  function hasTurbolinks() {
    return typeof Turbolinks !== "undefined" && Turbolinks.supported;
  }
  function turbolinksVisit(params) {
    var path = [ window.location.pathname, "?", this.toQueryString(params) ].join("");
    Turbolinks.visit(path);
  }
  function queryStringToParams() {
    var decode = function decode(value) {
      return decodeURIComponent((value || "").replace(/\+/g, "%20"));
    };
    return this.queryString().split("&").map(function(pair) {
      return pair.split("=");
    }).map(function(_ref) {
      var key = _ref[0], value = _ref[1];
      return {
        name: decode(key),
        value: decode(value)
      };
    });
  }
  function toQueryString(params) {
    var encode = function encode(value) {
      return encodeURIComponent(value || "");
    };
    return params.map(function(_ref2) {
      var name = _ref2.name, value = _ref2.value;
      return [ encode(name), encode(value) ];
    }).map(function(pair) {
      return pair.join("=");
    }).join("&");
  }
  var PerPage = function() {
    function PerPage(element) {
      this.element = element;
    }
    var _proto = PerPage.prototype;
    _proto.update = function update() {
      var params = queryStringToParams().filter(function(_ref) {
        var name = _ref.name;
        return name != "per_page" || name != "page";
      });
      params.push({
        name: "per_page",
        value: this.element.value
      });
      if (hasTurbolinks()) {
        turbolinksVisit(params);
      } else {
        window.location.search = toQueryString(params);
      }
    };
    PerPage._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function() {
        var $this = $(this);
        var data = $this.data("perPage");
        if (!data) {
          data = new PerPage(this);
          $this.data("perPage", data);
        }
        if (config === "update") {
          data[config]();
        }
      });
    };
    return PerPage;
  }();
  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }
  var TableCheckboxToggler = function(_CheckboxToggler) {
    _inheritsLoose(TableCheckboxToggler, _CheckboxToggler);
    function TableCheckboxToggler() {
      return _CheckboxToggler.apply(this, arguments) || this;
    }
    var _proto = TableCheckboxToggler.prototype;
    _proto._bind = function _bind() {
      var _this = this;
      _CheckboxToggler.prototype._bind.apply(this, arguments);
      this.$container.find("tbody td").click(function(event) {
        if (event.target.type !== "checkbox") {
          _this._didClickCell(event.target);
        }
      });
    };
    _proto._didChangeCheckbox = function _didChangeCheckbox(checkbox) {
      _CheckboxToggler.prototype._didChangeCheckbox.apply(this, arguments);
      $(checkbox).parents("tr").toggleClass("selected", checkbox.checked);
    };
    _proto._didChangeToggleAllCheckbox = function _didChangeToggleAllCheckbox() {
      this.$container.find("tbody tr").toggleClass("selected", _CheckboxToggler.prototype._didChangeToggleAllCheckbox.apply(this, arguments));
    };
    _proto._didClickCell = function _didClickCell(cell) {
      $(cell).parent("tr").find(":checkbox").click();
    };
    return TableCheckboxToggler;
  }(CheckboxToggler);
  $.widget.bridge("tableCheckboxToggler", TableCheckboxToggler);
  $.widget.bridge("checkboxToggler", CheckboxToggler);
  $.widget.bridge("aaDropdownMenu", DropdownMenu);
  $.widget.bridge("aaBatchActions", BatchActions);
  var initBatchActions = function initBatchActions() {
    return $("#collection_selection").aaBatchActions();
  };
  $(document).ready(initBatchActions).on("page:load turbolinks:load", initBatchActions);
  var initDropdownMenus = function initDropdownMenus() {
    return $(".dropdown_menu").aaDropdownMenu();
  };
  $(document).ready(initDropdownMenus).on("page:load turbolinks:load", initDropdownMenus);
  $(document).on("change", ".pagination_per_page > select", function(event) {
    PerPage._jQueryInterface.call($(this), "update");
  });
  $.fn["perPage"] = PerPage._jQueryInterface;
  $.fn["perPage"].Constructor = PerPage;
  $(document).on("focus", "input.datepicker:not(.hasDatepicker)", function() {
    var input = $(this);
    if (input[0].type === "date") {
      return;
    }
    var defaults = {
      dateFormat: "yy-mm-dd"
    };
    var options = input.data("datepicker-options");
    input.datepicker($.extend(defaults, options));
  });
  var Filters = function() {
    function Filters() {}
    Filters._clearForm = function _clearForm(event) {
      var regex = /^(q\[|q%5B|q%5b|page|utf8|commit)/;
      var params = queryStringToParams().filter(function(_ref) {
        var name = _ref.name;
        return !name.match(regex);
      });
      event.preventDefault();
      if (hasTurbolinks()) {
        turbolinksVisit(params);
      } else {
        window.location.search = toQueryString(params);
      }
    };
    Filters._disableEmptyInputFields = function _disableEmptyInputFields(event) {
      var params = $(this).find(":input").filter(function(i, input) {
        return input.value === "";
      }).prop({
        disabled: true
      }).end().serializeArray();
      if (hasTurbolinks()) {
        event.preventDefault();
        turbolinksVisit(params);
      }
    };
    Filters._setSearchType = function _setSearchType() {
      $(this).siblings("input").prop({
        name: "q[" + this.value + "]"
      });
    };
    return Filters;
  }();
  $(document).on("click", ".clear_filters_btn", Filters._clearForm).on("submit", ".filter_form", Filters._disableEmptyInputFields).on("change", ".filter_form_field.select_and_search select", Filters._setSearchType);
  var onDOMReady = function onDOMReady() {
    return $("#active_admin_content .tabs").tabs();
  };
  $(document).ready(onDOMReady).on("page:load turbolinks:load", onDOMReady);
});
