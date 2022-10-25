import { validationEvents, validationErrorCodes } from '../../util/ValidationConstants'
import { extractBuinessName } from '../../util/ValidationUtil'
import { getBBox } from 'diagram-js/lib/util/Elements';
import { 
  domify, 
  query as domQuery, 
  event as domEvent } from 'min-dom';

export default class ValidationNotifier {
  
  constructor(eventBus, canvas, translate) {
    var self = this;

    this._eventBus = eventBus;
    this._canvas = canvas;
    this._translate = translate;

    eventBus.on(validationEvents.STOP_VALIDATION, this._hideNotifications.bind(self));
    eventBus.on(validationEvents.FINISH_VALIDATION, (context) => {
      self.currentErrors = context.currentErrors;

      if (self.currentErrors.length == 0) {
        self._showNoErrorNotifications();
      } else {
        self._showErrorNotifications();
      }

    });

    this._eventBus.on('import.parse.start', this._hideNotifications.bind(self));
  }

  _showNoErrorNotifications() {
    this.container = domify('<div class="sgv-notifications no-errors">' +
      '<img class="sgv-info-icon" alt="Stylguide-Celebration-Icon" src="icon/confetti.svg"></img>' +
      `<p>${this._translate('Well done, no guideline violations can be found!')}</p></div>`);
    this._canvas.getContainer().appendChild(this.container);
  }

  _showErrorNotifications() {
    let html = '<div class="sgv-notifications errors">' +
      '<img class="sgv-info-icon" alt="Stylguide-Warn-Icon" src="icon/warning.svg"></img>' +
      `<p>${this._translate('Ups, we found some guideline violations!')}</p></div>`;

    this.container = domify(html);
    this._canvas.getContainer().appendChild(this.container);

    this._addErrorNotifications(this.currentErrors);

  }

  _addErrorNotifications(errors) {
    let sortedErrors = this._sortValidationErrors(errors);
    let container = domQuery(ValidationNotifier.ERROR_CATEGORY_QUERY, this._canvas.getContainer());
    
    for (let errorCategory in sortedErrors) {
      let categoryName = errorCategory.replace(/_/g, " ").toLowerCase();
      let parentNode = domify(
        `<button class="sgv-error-list-category">
          <img class="sgv-down-arrow-icon" alt="Stylguide-Down-Arrow" src="icon/down-arrow.svg"></img> 
          ${this._formatCategoryName(this._translate(categoryName))}
        </button>`);
      container.appendChild(parentNode);
      let childNode = domify(`<div class="sgv-error-list-panel"></div>`);
      container.appendChild(childNode);

      sortedErrors[errorCategory].forEach(error => {
        let node = {};
        let errorElement = error.element;
        let errorNotification = error.notification;
        node = (errorCategory !== validationErrorCodes.START_AND_END_EVENT) ?
          this._buildNotificationHtml(errorNotification, errorElement) :
          domify(
            ` <div class="sgv-error-list-panel-element nocursor">
                <p>${this._translate('Start and/or end event is missing in the hole')}</p>
                <p><span class="bold">${errorElement}</span></p>
              </div>`);

        if (errorCategory !== validationErrorCodes.START_AND_END_EVENT) {
          domEvent.bind(node, 'click', this._centerViewbox.bind(this, errorElement));
        }
        childNode.appendChild(node);
      });
    }
    this._bindEvents();
  }

  _formatCategoryName(name) {
    return name.replace(/_/g, " ").toLowerCase().charAt(0).toUpperCase() + name.slice(1);
  }

  _centerViewbox(element) {
    var viewbox = this._canvas.viewbox();

    var box = getBBox(element);

    var newViewbox = {
      x: (box.x + box.width / 2) - viewbox.outer.width / 2,
      y: (box.y + box.height / 2) - viewbox.outer.height / 2,
      width: viewbox.outer.width,
      height: viewbox.outer.height
    };

    this._canvas.viewbox(newViewbox);

    this._canvas.zoom(viewbox.scale);
  };

  _sortValidationErrors(errors) {
    let sortedErrors = {};

    errors.forEach(error => {
      if (!sortedErrors.hasOwnProperty(error.errorType)) {
        sortedErrors[error.errorType] = []
      }
      sortedErrors[error.errorType].push(error)
    })

    return sortedErrors;

  }

  _bindEvents() {
    var acc = document.getElementsByClassName(ValidationNotifier.BUTTON_QUERY);
    var i;

    for (i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    }
  }


  _hideNotifications() {
    if (this.container) {
      this.container.remove();
    }
  }

  _buildNotificationHtml(hint, errorElement) {
    return domify(
      `<div class="sgv-error-list-panel-element">
        <p>${hint}</p>
        <p><span class="bold">${extractBuinessName(errorElement.businessObject.$type)}</span></p>
      </div>`);
  }

}
ValidationNotifier.ERROR_CATEGORY_QUERY = '.sgv-notifications';
ValidationNotifier.BUTTON_QUERY = 'sgv-error-list-category';

ValidationNotifier.$inject = ['eventBus', 'canvas', 'translate'];