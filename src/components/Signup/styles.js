import styled from 'styled-components';

export const StyledForm = styled.div`
  .gform * {
    box-sizing: border-box;
  }

  .gform legend {
    border: none;
    font-size: inherit;
    margin-bottom: 10px;
    padding: 0;
    position: relative;
    display: table;
  }

  .gform fieldset {
    border: 0;
    padding: 0.01em 0 0 0;
    margin: 0;
    min-width: 0;
  }

  .gform body:not(:-moz-handler-blocked) fieldset {
    display: table-cell;
  }

  .gform p {
    color: inherit;
    font-size: inherit;
    font-weight: inherit;
  }

  .gform[data-format='modal'] {
    display: none;
  }

  .gform[data-format='slide in'] {
    display: none;
  }

  .gform .gform-input,
  .gform .gform-select,
  .gform .gform-checkboxes {
    width: 100%;
  }

  .gform .gform-button,
  .gform .gform-submit {
    border: 0;
    border-radius: 5px;
    color: #ffffff;
    cursor: pointer;
    display: inline-block;
    text-align: center;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    margin-bottom: 15px;
    overflow: hidden;
    padding: 0;
    position: relative;
    vertical-align: middle;
  }

  .gform .gform-button:hover,
  .gform .gform-submit:hover,
  .gform .gform-button:focus,
  .gform .gform-submit:focus {
    outline: none;
  }

  .gform .gform-button:hover > span,
  .gform .gform-submit:hover > span,
  .gform .gform-button:focus > span,
  .gform .gform-submit:focus > span {
    background-color: hsl(340, 63%, 63%);
  }

  .gform .gform-button > span,
  .gform .gform-submit > span {
    display: block;
    -webkit-transition: all 300ms ease-in-out;
    transition: all 300ms ease-in-out;
    padding: 12px 24px;
  }

  .gform .gform-input {
    background: #ffffff;
    font-size: 15px;
    padding: 12px;
    border: 1px solid #e3e3e3;
    -webkit-flex: 1 0 auto;
    -ms-flex: 1 0 auto;
    flex: 1 0 auto;
    line-height: 1.4;
    margin: 0;
    -webkit-transition: border-color ease-out 300ms;
    transition: border-color ease-out 300ms;
  }

  .gform .gform-input:focus {
    outline: none;
    border-color: #1677be;
    -webkit-transition: border-color ease 300ms;
    transition: border-color ease 300ms;
  }

  .gform .gform-input::-webkit-input-placeholder {
    color: #848585;
  }

  .gform .gform-input::-moz-placeholder {
    color: #848585;
  }

  .gform .gform-input:-ms-input-placeholder {
    color: #848585;
  }

  .gform .gform-input::placeholder {
    color: #848585;
  }

  .gform [data-group='dropdown'] {
    position: relative;
    display: inline-block;
    width: 100%;
  }

  .gform [data-group='dropdown']::before {
    content: '';
    top: calc(50% - 2.5px);
    right: 10px;
    position: absolute;
    pointer-events: none;
    border-color: #4f4f4f transparent transparent transparent;
    border-style: solid;
    border-width: 6px 6px 0 6px;
    height: 0;
    width: 0;
    z-index: 999;
  }

  .gform [data-group='dropdown'] select {
    height: auto;
    width: 100%;
    cursor: pointer;
    color: #333333;
    line-height: 1.4;
    margin-bottom: 0;
    padding: 0 6px;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    font-size: 15px;
    padding: 12px;
    padding-right: 25px;
    border: 1px solid #e3e3e3;
    background: #ffffff;
  }

  .gform [data-group='dropdown'] select:focus {
    outline: none;
  }

  .gform [data-group='checkboxes'] {
    text-align: left;
    margin: 0;
  }

  .gform [data-group='checkboxes'] [data-group='checkbox'] {
    margin-bottom: 10px;
  }

  .gform [data-group='checkboxes'] [data-group='checkbox'] * {
    cursor: pointer;
  }

  .gform [data-group='checkboxes'] [data-group='checkbox']:last-of-type {
    margin-bottom: 0;
  }

  .gform [data-group='checkboxes'] [data-group='checkbox'] input[type='checkbox'] {
    display: none;
  }

  .gform [data-group='checkboxes'] [data-group='checkbox'] input[type='checkbox'] + label::after {
    content: none;
  }

  .gform [data-group='checkboxes'] [data-group='checkbox'] input[type='checkbox']:checked + label::after {
    border-color: #ffffff;
    content: '';
  }

  .gform [data-group='checkboxes'] [data-group='checkbox'] input[type='checkbox']:checked + label::before {
    background: #10bf7a;
    border-color: #10bf7a;
  }

  .gform [data-group='checkboxes'] [data-group='checkbox'] label {
    position: relative;
    display: inline-block;
    padding-left: 28px;
  }

  .gform [data-group='checkboxes'] [data-group='checkbox'] label::before,
  .gform [data-group='checkboxes'] [data-group='checkbox'] label::after {
    position: absolute;
    content: '';
    display: inline-block;
  }

  .gform [data-group='checkboxes'] [data-group='checkbox'] label::before {
    height: 16px;
    width: 16px;
    border: 1px solid #e3e3e3;
    background: #ffffff;
    left: 0px;
    top: 3px;
  }

  .gform [data-group='checkboxes'] [data-group='checkbox'] label::after {
    height: 4px;
    width: 8px;
    border-left: 2px solid #4d4d4d;
    border-bottom: 2px solid #4d4d4d;
    -webkit-transform: rotate(-45deg);
    -ms-transform: rotate(-45deg);
    transform: rotate(-45deg);
    left: 4px;
    top: 8px;
  }

  .gform .gform-spinner {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    height: 0px;
    width: 0px;
    margin: 0 auto;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 0px;
    overflow: hidden;
    text-align: center;
    -webkit-transition: all 300ms ease-in-out;
    transition: all 300ms ease-in-out;
  }

  .gform .gform-spinner > div {
    margin: auto;
    width: 12px;
    height: 12px;
    background-color: #fff;
    opacity: 0.3;
    border-radius: 100%;
    display: inline-block;
    -webkit-animation: gform-bouncedelay-gform-data-uid-4a352cb1fd- 1.4s infinite ease-in-out both;
    animation: gform-bouncedelay-gform-data-uid-4a352cb1fd- 1.4s infinite ease-in-out both;
  }

  .gform .gform-spinner > div:nth-child(1) {
    -webkit-animation-delay: -0.32s;
    animation-delay: -0.32s;
  }

  .gform .gform-spinner > div:nth-child(2) {
    -webkit-animation-delay: -0.16s;
    animation-delay: -0.16s;
  }

  .gform .gform-submit[data-active] .gform-spinner {
    opacity: 1;
    height: 100%;
    width: 50px;
  }

  .gform .gform-submit[data-active] .gform-spinner ~ span {
    opacity: 0;
  }

  @-webkit-keyframes gform-bouncedelay-gform-data-uid-4a352cb1fd- {
    0%,
    80%,
    100% {
      -webkit-transform: scale(0);
      -ms-transform: scale(0);
      transform: scale(0);
    }
    40% {
      -webkit-transform: scale(1);
      -ms-transform: scale(1);
      transform: scale(1);
    }
  }

  @keyframes gform-bouncedelay-gform-data-uid-4a352cb1fd- {
    0%,
    80%,
    100% {
      -webkit-transform: scale(0);
      -ms-transform: scale(0);
      transform: scale(0);
    }
    40% {
      -webkit-transform: scale(1);
      -ms-transform: scale(1);
      transform: scale(1);
    }
  }

  .gform {
    box-shadow: 0 2px 15px 0 rgba(210, 214, 220, 0.5);
    max-width: 700px;
    overflow: hidden;
  }

  .gform [data-style='full'] {
    width: 100%;
    display: block;
  }

  .gform .gform-header {
    margin-top: 0;
    margin-bottom: 20px;
    font-family: inherit;
  }

  .gform .gform-subheader {
    margin: 15px 0;
  }

  .gform .gform-column {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    padding: 20px;
  }

  .gform .gform-column:nth-child(2) {
    border-top: 1px solid #e9ecef;
  }

  .gform .gform-field {
    margin: 0 0 15px 0;
  }

  .gform .gform-input,
  .gform .gform-submit {
    width: 100%;
  }

  .gform .gform-guarantee {
    font-size: 13px;
    margin: 0 0 15px 0;
  }

  .gform .gform-guarantee > p {
    margin: 0;
  }

  .gform .gform-powered-by {
    color: #7d7d7d;
    display: block;
    font-size: 12px;
    margin-bottom: 0;
    text-align: center;
  }

  .gform .gform-powered-by[data-active='false'] {
    opacity: 0.5;
  }

  .gform[min-width~='600'] [data-style='full'],
  .gform[min-width~='700'] [data-style='full'],
  .gform[min-width~='800'] [data-style='full'] {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  .gform[min-width~='600'] .gform-submit,
  .gform[min-width~='700'] .gform-submit,
  .gform[min-width~='800'] .gform-submit {
    width: auto;
  }

  .gform[min-width~='600'] .gform-column,
  .gform[min-width~='700'] .gform-column,
  .gform[min-width~='800'] .gform-column {
    padding: 40px;
  }

  .gform[min-width~='600'] .gform-column:nth-child(2),
  .gform[min-width~='700'] .gform-column:nth-child(2),
  .gform[min-width~='800'] .gform-column:nth-child(2) {
    border-top: none;
  }

  .gform {
    background-color: rgb(255, 255, 255);
    border-radius: 6px;
  }

  .gform-column {
    background-color: rgb(249, 250, 251);
  }

  .gform-header {
    color: rgb(77, 77, 77);
    font-size: 20px;
    font-weight: 700;
  }

  .gform-subheader {
    color: rgb(104, 104, 104);
  }

  .gform-input {
    border-color: rgb(227, 227, 227);
    border-radius: 4px;
    color: rgb(0, 0, 0);
    font-weight: 400;
  }

  .gform-submit {
    background-color: hsl(340, 63%, 55%);
    border-radius: 24px;
    color: white;
    font-weight: 700;
  }

  .gform-guarantee {
    color: rgb(77, 77, 77);
    font-size: 13px;
    font-weight: 400;
  }

  .gform-image svg {
    max-width: 100%;
  }

  .error {
    border-color: red;
  }

  .gform-field span {
    font-size: 13px;
    color: red;
  }

  .thank-you {
    color: var(--bg);
  }
`;
