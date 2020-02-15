
import { Control } from 'ol/control';

/**
 * Add Custom Control to Map
 *
 * @param {string} btnHtml       button innerHtml
 * @param {string} btnClassName  button class, need specify top and left
 * @param {callable} handler     button click handler
 */
export const addControl = function (btnHtml, btnClassName, handler) {
    return (function (Control) {
        function CustomControl(opt_options) {
            var options = opt_options || {};

            var button = document.createElement('button');
            button.innerHTML = btnHtml;

            var element = document.createElement('div');
            element.className = 'ol-unselectable ol-control ' + btnClassName;
            element.appendChild(button);

            Control.call(this, {
                element: element,
                target: options.target
            });

            button.addEventListener('click', handler, false);
        }

        if ( Control ) CustomControl.__proto__ = Control;
        CustomControl.prototype = Object.create( Control && Control.prototype );
        CustomControl.prototype.constructor = CustomControl;

        return CustomControl;
    }(Control));
}