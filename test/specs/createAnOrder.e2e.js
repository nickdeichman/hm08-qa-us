const page = require('../../page');
// eslint-disable-next-line no-unused-vars
const helper = require('../../helper');

const fromFieldValue = 'East 2nd Street, 601';
const toFieldValue = '1300 1st St';

describe('Create an order', () => {
  it('should set the address', async () => {
    await browser.url(`/`);
    const fromField = await $(page.fromField);
    const toField = await $(page.toField);
    await page.fillAddresses(fromFieldValue, toFieldValue);
    await expect(await fromField.getValue()).toBe(fromFieldValue);
    await expect(await toField.getValue()).toBe(toFieldValue);
  });

  it('should open phone number modal', async () => {
    await browser.url(`/`);
    await page.fillAddresses(fromFieldValue, toFieldValue);
    const phoneNumberButton = await $(page.phoneNumberButton);
    await phoneNumberButton.waitForDisplayed();
    await phoneNumberButton.click();
    const pnoneNumberModal = await $(page.phoneNumberModal);
    await expect(pnoneNumberModal).toBeExisting();
  });

  it('should save the phone', async () => {
    await browser.url(`/`);
    await page.fillAddresses('East 2nd Street, 601', '1300 1st St');
    const phoneNumber = helper.getPhoneNumber('+1');
    await page.submitPhoneNumber(phoneNumber);
    await expect(await helper.getElementByText(phoneNumber)).toBeExisting();
  });

  it('should add credit card as a payment method', async () => {
    await browser.url(`/`);
    await page.fillAddresses('East 2nd Street, 601', '1300 1st St');
    const paymentMethodBtn = await $(page.paymentMethodBtn);
    const cardNumber = helper.getCreditCardNumber();
    const cardCode = helper.getCreditCardCode();
    await page.addCreditCard(cardNumber, cardCode);
    await expect(await paymentMethodBtn.getText()).toContain('Card');
  });

  it('should select supportive tariff', async () => {
    await browser.url(`/`);
    await page.fillAddresses('East 2nd Street, 601', '1300 1st St');
    await page.selectTaxiPlan('Supportive');
    const isSupportivePlanSelected = await $(
      '.tariff-cards .tcard:nth-child(5)'
    ).getAttribute('class');
    expect(isSupportivePlanSelected.includes('active')).toBe(true);
  });

  it('should add 2 (two) ice creams to the order', async () => {
    await browser.url(`/`);
    await page.fillAddresses('East 2nd Street, 601', '1300 1st St');
    await page.selectTaxiPlan('Supportive');
    const iceCreamCounter = await $(page.iceCreamCounter);
    await page.orderIceCream(2);
    await expect(await iceCreamCounter.getText()).toContain('2');
  });

  it('should add comment to the driver', async () => {
    await browser.url(`/`);
    await page.fillAddresses('East 2nd Street, 601', '1300 1st St');
    await page.selectTaxiPlan('Supportive');
    const commentField = await $(page.commentToDriver);
    const message = 'Hello there';
    await page.fillCommentToDriver(message);
    await expect(await commentField.getValue()).toBe(message);
  });

  it('should order a blanket and handkerchiefs', async () => {
    await browser.url(`/`);
    await page.fillAddresses('East 2nd Street, 601', '1300 1st St');
    await page.selectTaxiPlan('Supportive');
    const blanketAndHandkerchiefsCheckbox = await $(
      page.blanketAndHandkerchiefsCheckbox
    );
    await page.orderBlanketAndHandkerchiefs();
    await expect(await blanketAndHandkerchiefsCheckbox.isSelected()).toBe(true);
  });

  it('should order a taxi with supportive tariff, blanket and handkerchiefs, 2 ice creams and message to the driver', async () => {
    await browser.url(`/`);
    await page.fillAddresses('East 2nd Street, 601', '1300 1st St');
    const phoneNumber = helper.getPhoneNumber('+1');
    await page.submitPhoneNumber(phoneNumber);
    const cardNumber = helper.getCreditCardNumber();
    const cardCode = helper.getCreditCardCode();
    await page.orderTaxi('Supportive', cardNumber, cardCode, 'Hello there');
    await page.checkOrderModalInfo();
  });

  it('should display driver info after order was sent', async () => {
    await browser.url(`/`);
    await page.fillAddresses('East 2nd Street, 601', '1300 1st St');
    const phoneNumber = helper.getPhoneNumber('+1');
    await page.submitPhoneNumber(phoneNumber);
    const cardNumber = helper.getCreditCardNumber();
    const cardCode = helper.getCreditCardCode();
    await page.orderTaxi('Supportive', cardNumber, cardCode, 'Hello there');
    await page.checkOrderModalInfo();
    // eslint-disable-next-line wdio/no-pause
    await browser.pause(41000);
    const carPlateNumber = await $(page.carPlateNumber);
    await expect(await carPlateNumber).toBeExisting();
  });
});
