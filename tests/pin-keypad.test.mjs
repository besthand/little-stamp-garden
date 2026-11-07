import test from 'node:test';
import assert from 'node:assert/strict';
import {nextPinValue} from '../dist/pin-keypad.js';
import {makePin,verifyPin} from '../dist/core.js';
test('keypad enters digits including leading zero and supports erase/clear',()=>{let value='';for(const key of ['0','4','8','2'])value=nextPinValue(value,key,8);assert.equal(value,'0482');assert.equal(nextPinValue(value,'backspace',8),'048');assert.equal(nextPinValue(value,'clear',8),'');assert.equal(nextPinValue('','backspace',8),'');assert.equal(nextPinValue(value,'x',8),value);});
test('keypad enforces setup and padded-password length limits',()=>{assert.equal(nextPinValue('12345678','9',8),'12345678');assert.equal(nextPinValue('1'.repeat(32),'2',32),'1'.repeat(32));assert.equal(nextPinValue('1234','clear',32),'');});
test('keypad input preserves virtual-password verification',async()=>{let value='';for(const key of '99048273')value=nextPinValue(value,key,32);const pin=await makePin('0482');assert.equal(await verifyPin(value,pin),true);assert.equal(await verifyPin(nextPinValue(value,'clear',32),pin),false);});
