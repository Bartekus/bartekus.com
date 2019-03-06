import React, { useState, useEffect } from 'react';
import isEmail from 'validator/lib/isEmail';

import { StyledForm } from './styles';
import { formSVG } from './envelope.svg';

function validate(firstName, email) {
  const isRequired = value => value.length === 0 && 'Required field';

  return {
    firstName: isRequired(firstName),
    email: isRequired(email) || (!isEmail(email) && 'Invalid email address'),
  };
}

function Signup(props) {
  const [registered, setRegistered] = useState(() => (typeof window !== 'undefined' && JSON.parse(localStorage.getItem('registered'))) || false);
  const [sayThankYou, setSayThankYou] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState({ firstName: false, email: false });

  const _handleSubmission = event => {
    event.preventDefault();

    const data = {
      firstName: firstName,
      email: email,
    };

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://script.google.com/macros/s/AKfycbwETvprOrQwc0pNi4awRY-EdHR3Lsfq2sG4ZNiv/exec');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
      if (xhr.status === 200) {
        setRegistered(true);
        setSayThankYou(true);
        localStorage.setItem('registered', JSON.stringify(true));
      }

      return 0;
    };

    const encoded = Object.keys(data)
      .map(function(k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
      })
      .join('&');

    xhr.send(encoded);

    return false;
  };

  useEffect(() => {
    try {
      const localStorageRegisteredState = JSON.parse(localStorage.getItem('registered'));
      setRegistered(localStorageRegisteredState);
    } catch (err) {}
  }, [registered]);

  const handleBlur = field => evt => {
    setTouched({ ...touched, [field]: true });
  };

  if (sayThankYou) {
    return (
      <StyledForm>
        <div className="gform">
          <div data-style="full">
            <div data-element="column" className="gform-column thank-you">
              <h1>Thank you for subscribing.</h1>
              <p>You are now confirmed. You can expect to receive emails as I create new content.</p>
            </div>
          </div>
        </div>
      </StyledForm>
    );
  }

  const errors = validate(firstName, email);
  const isEnabled = !Object.keys(errors).some(x => errors[x]);

  const shouldMarkError = field => {
    const hasError = errors[field];
    const shouldShow = touched[field];
    return hasError ? shouldShow : false;
  };

  return registered ? (
    <div> </div>
  ) : (
    <StyledForm>
      <form id="sender-subscribe" className="gform" method="POST" min-width="400 500 600 700 800">
        <div data-style="full">
          <div data-element="column" className="gform-column">
            <h1 className="gform-header" data-element="header">
              Join the Newsletter
            </h1>
            <div data-element="subheader" className="gform-subheader">
              <p>Subscribe to get my latest content by email.</p>
            </div>
            <div className="gform-image">{formSVG()}</div>
          </div>
          <div data-element="column" className="gform-column">
            <div data-element="fields" className="seva-fields gform-fields">
              <div className="gform-field">
                <input
                  className={'gform-input'}
                  style={shouldMarkError('firstName') ? { borderColor: 'red' } : null}
                  aria-label="Your first name"
                  placeholder="Your first name"
                  name="firstName"
                  id="firstName"
                  data-label="First name"
                  value={firstName}
                  onChange={event => setFirstName(event.target.value)}
                  onBlur={handleBlur('firstName')}
                />
                <span>{shouldMarkError('firstName') ? `${errors.firstName}` : null}</span>
              </div>
              <div className="gform-field">
                <input
                  className={'gform-input'}
                  style={shouldMarkError('email') ? { borderColor: 'red' } : null}
                  aria-label="Your email address"
                  placeholder="Your email address"
                  name="email"
                  id="email"
                  data-label="Email"
                  required
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  onBlur={handleBlur('email')}
                />
                <span>{shouldMarkError('email') ? `${errors.email}` : null}</span>
              </div>
              <button
                data-element="submit"
                type="submit"
                className="gform-submit"
                onClick={_handleSubmission}
                disabled={!isEnabled}
                style={!isEnabled ? { cursor: 'not-allowed' } : null}
              >
                <div className="gform-spinner" />
                <span style={!isEnabled ? { backgroundColor: 'gray' } : null}>Subscribe</span>
              </button>
            </div>

            <div data-element="guarantee" className="gform-guarantee">
              <p>I won’t send you spam.</p>
              <p>
                Unsubscribe at <em>any</em> time.
              </p>
            </div>
          </div>
        </div>
      </form>
    </StyledForm>
  );
}

export default Signup;
