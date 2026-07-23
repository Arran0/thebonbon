(function () {
  var KLAVIYO_REVISION = '2024-10-15';

  function handleSubmit(event) {
    var form = event.currentTarget;
    event.preventDefault();

    var companyId = form.getAttribute('data-klaviyo-company-id');
    var listId = form.getAttribute('data-klaviyo-list-id');
    var emailInput = form.querySelector('[data-waitlist-email]');
    var nameInput = form.querySelector('[data-waitlist-name]');
    var submitButton = form.querySelector('[type="submit"]');
    var errorEl = form.querySelector('[data-waitlist-error]');
    var fieldsEl = form.querySelector('[data-waitlist-fields]');
    var successEl = form.querySelector('[data-waitlist-success]');

    if (!companyId || !listId || !emailInput || !emailInput.value.trim()) {
      return;
    }

    var profileAttributes = { email: emailInput.value.trim() };
    if (nameInput && nameInput.value.trim()) {
      profileAttributes.first_name = nameInput.value.trim();
    }

    if (errorEl) {
      errorEl.hidden = true;
      errorEl.textContent = '';
    }
    if (submitButton) submitButton.disabled = true;

    fetch('https://a.klaviyo.com/client/subscriptions/?company_id=' + encodeURIComponent(companyId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        revision: KLAVIYO_REVISION,
      },
      body: JSON.stringify({
        data: {
          type: 'subscription',
          attributes: {
            profile: {
              data: {
                type: 'profile',
                attributes: profileAttributes,
              },
            },
          },
          relationships: {
            list: {
              data: {
                type: 'list',
                id: listId,
              },
            },
          },
        },
      }),
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Klaviyo subscribe failed with status ' + response.status);
        }
        if (fieldsEl) fieldsEl.hidden = true;
        if (successEl) successEl.hidden = false;
      })
      .catch(function () {
        if (submitButton) submitButton.disabled = false;
        if (errorEl) {
          errorEl.hidden = false;
          errorEl.textContent = 'Something went wrong. Please try again.';
        }
      });
  }

  document.querySelectorAll('.waitlist-signup-form').forEach(function (form) {
    form.addEventListener('submit', handleSubmit);
  });
})();
