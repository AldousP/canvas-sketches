"use strict";

var InputType = {
  button : false,
  axis : new Vector(0, 0)
};

var Commands = {
  actionButton1 : InputType.button,
  actionButton2 : InputType.button,
  actionButton3 : InputType.button,
  actionButton4 : InputType.button,
  axis1 : InputType.axis
};

var virtual_input_enum = {
	name : "Virtual Input A",
	virtualButton1 : InputType.button,
	virtualButton2 : InputType.button,
	virtualButtonUp : InputType.button,
	virtualButtonDown : InputType.button,
	virtualButtonLeft : InputType.button,
	virtualButtonRight : InputType.button,
	virtualButtonStart : InputType.button,
	virtualButtonSelect : InputType.button
};