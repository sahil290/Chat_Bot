import React, {useState, useEffect, forwardRef, useRef, useInsertionEffect} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
const Chatbot = () => {
  const [newEventEnquiryMessages, setNewEventEnquiryMessages] = useState([
    {
      text: "Hello and Welcome! Please select from the below options:",
      options: [
        {value: "New Event Enquiry", label: "New Event Enquiry", trigger: "1"},
        {value: "Existing Event Enquiry", label: "Existing Event Enquiry", trigger: "2"},
        {value: "New Vendor Registration", label: "New Vendor Registration", trigger: "3"},
        {value: "Booking Assistance", label: "Booking Assistance", trigger: "4"},
      ],
      showButtons: true,
      firstButtons: true,
    },
  ]);

  const [formData, setFormData] = useState({});
  const [startDate, setStartDate] = useState(new Date());
  const [link, setLink] = useState("");
  const [name, setName] = useState("");
  const [event_id, setEvent_Id] = useState("");
  const [concern, setConcern] = useState("");
  const [loading, setLoading] = useState(false);
  const [emptyInput, setEmptyInput] = useState(false);
  const [emptyGuest, setEmptyGuest] = useState(false);
  const [emptyInputArea, setEmptyInputArea] = useState(false);
  const ExampleCustomInput = forwardRef(({value, onClick}, ref) => (
    <button className="example-custom-input" onClick={onClick} ref={ref}>
      <img src="../../Calen.svg" alt="Calender Icon" /> {value}
    </button>
  ));
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
  };

  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);
  useEffect(() => {
    scrollToBottom();
  }, [newEventEnquiryMessages]);
  useEffect(() => {
    scrollToBottom();
  }, [loading]);
  const handleButtonClick = (option, index, trigger, name) => {
    let newMessages = [...newEventEnquiryMessages];
    let key;
    if (index === 0) {
      key = "enquiry_type";
    } else if (index === 1) {
      key = "ocassion";
    }
    if (trigger > 4) {
      setFormData({...formData, ocassion_name: name});
    } else {
      setFormData({...formData, event_type: option});
    }
    newMessages[index].showButtons = false;
    if (trigger === 2) {
      newMessages.push({
        text: `Kindly share your name, event id and concern`,
        showButtons: true,
        threeInputs: true,
      });
    } else if (trigger === 3) {
      console.log("Third button");
    } else if (trigger === 4) {
      console.log("Third button");
    } else {
      if (index === 0) {
        newMessages.push({
          text: `I'm here to help you find the perfect venue for your event. May I know your name`,
          userText: `${option}`,
          showNameField: true,
        });
      } else {
        newMessages.push({
          userText: `${option}`,
          text: `Great! Could you tell me number of guests you are expecting at your ${option}`,
          input: true,
          key: "guests",
        });
      }
    }
    setNewEventEnquiryMessages(newMessages);
  };
  const handleUserName = (value, index, key) => {
    if (!value) {
      setEmptyInput(true);
      return;
    } else {
      setEmptyInput(true);
      let newMessages = [...newEventEnquiryMessages];
      newMessages[index].showNameField = false;
      newMessages.push({
        userText: `${value}`,
        text: `Hi ${value}. What is the type of event you're planning?`,
        options: [
          {value: "Wedding", label: "Wedding", trigger: "5"},
          {value: "Corporate Event", label: "Corporate Event", trigger: "6"},
          {value: "Social Get together", label: "Social Get together", trigger: "7"},
        ],
        showButtons: true,
      });
      setNewEventEnquiryMessages(newMessages);
      setFormData({...formData, user_name: value});
    }
  };
  const handleInputSubmit = (value, index, key) => {
    if (!value) {
      setEmptyGuest(true);
      return;
    } else {
      setEmptyGuest(true);
      let newMessages = [...newEventEnquiryMessages];
      newMessages[index].input = false;
      newMessages.push({
        userText: `${value}`,
        text: `You're expecting ${value} guests. Kindly confirm your event date:`,
        datePicker: true,
      });
      setNewEventEnquiryMessages(newMessages);
      setFormData({...formData, [key]: value});
    }
  };

  const handleDateSelect = (date, index) => {
    setStartDate(date);
    setFormData({...formData, eventDate: date});
    let newMessages = [...newEventEnquiryMessages];
    newMessages[index].datePicker = false;
    newMessages.push({
      userText: `${moment(date).format("ll")}`,
      text: `Great! Could you tell me the preferred area/city for your event?`,
      preferredAreaInput: true,
    });
    setNewEventEnquiryMessages(newMessages);
  };

  const handleAreaInputSubmit = (value, index) => {
    if (!value) {
      setEmptyInputArea(true);
      setTimeout(() => {
        setEmptyInputArea(false);
      }, 1000);
      return;
    } else if (value && !isNaN(value)) {
      setEmptyInputArea(true);
      setTimeout(() => {
        setEmptyInputArea(false);
      }, 1000);
      return;
    } else {
      setFormData({...formData, preferredArea: value.toLowerCase()});
      let newMessages = [...newEventEnquiryMessages];
      newMessages[index].preferredAreaInput = false;
      newMessages.push({
        userText: `${value}`,
        text: `Kindly Share your Phone Number for us to share the list of recommended venues.`,
        userNumber: true,
      });

      setNewEventEnquiryMessages(newMessages);
    }
  };
  const threeInputs = (value, type) => {
    if (type == "name") {
      setName(value);
    } else if (type == "event_id") {
      setEvent_Id(value);
    } else if (type == "concern") {
      setConcern(value);
    }
  };

  const hideThreeInputs = (index) => {
    let newMessages = [...newEventEnquiryMessages];
    newMessages[index].threeInputs = false;
    newMessages.push({
      text: `We have received your concern, our team will get back to you shortly.`,
      triggerEmail: true,
    });

    setNewEventEnquiryMessages(newMessages);
  };
  const getUserNumber = (value, index, key) => {
    if (value.length > 10) {
      setEmptyInputArea(true);
      setTimeout(() => {
        setEmptyInputArea(false);
      }, 1000);
      return;
    } else if (value.length < 10) {
      setEmptyInputArea(true);
      setTimeout(() => {
        setEmptyInputArea(false);
      }, 1000);
      return;
    } else {
      setLoading(true);
      setFormData({...formData, phone_number: value});
      let newMessages = [...newEventEnquiryMessages];
      newMessages[index].userNumber = false;
      newMessages.push({
        userText: `${value}`,
        text: `Perfect! Based on your inputs, here are a few venue recommendations that match your criteria : `,
        link: true,
        showLink: true,
      });

      setTimeout(() => {
        let link = JSON.parse(localStorage.getItem("formData"));

        let newLink = `https://www.bookeventz.com/banquets/mumbai/${
          link.preferredArea
        }/${link.ocassion_name.toLowerCase()}?capacity-range=${link.guests}`;
        setLink(newLink);
        // Remove the input field message from the newEventEnquiryMessages array
        setLoading(false);
      }, 2000);
      setNewEventEnquiryMessages(newMessages);
    }
  };
  return (
    <div className="chatbot-container">
      <div id="top-bots-section">
        <div id="ops">
          <img src="../../bkz_icon.svg" alt="Bookeventz_Icon" />
          <span>Bookeventz</span>
        </div>
        <span id="doa9">-</span>
      </div>
      {loading ? (
        <div id="loader_198">
          <span id="loading_text">Getting results ready</span>
          <div class="loader4"></div>
        </div>
      ) : (
        <div id="message_wrapper">
          {newEventEnquiryMessages.map((message, index) => (
            <div key={index} className="message">
              {message.userText && (
                <div id="buio_wrapper_user">
                  <span id="bot_icon">
                    <img src="../../user_Icon.svg" alt="Bookeventz_Icon" />
                  </span>
                  <span id="bot_response"> {message.userText}</span>
                </div>
              )}
              {message.text && (
                <div id="buio_wrapper">
                  <span id="bot_icon">
                    <img src="../../bkz_icon.svg" alt="Bookeventz_Icon" />
                  </span>
                  <span id="bot_response">
                    {message.text}
                    {message.showLink ? (
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{lineBreak: "anywhere"}}
                      >
                        {link}
                      </a>
                    ) : null}
                  </span>
                </div>
              )}
              {message.options && message.showButtons && (
                <div className="buttons">
                  {message.options?.map((option, optionIndex) => {
                    return (
                      <button
                        key={optionIndex}
                        onClick={() =>
                          handleButtonClick(
                            option.label,
                            index,
                            parseInt(option.trigger),
                            option.label
                          )
                        }
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              )}
              {message.showNameField && (
                <div id="trying">
                  <div id={emptyInput ? "input_empty" : "input_one"}>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleUserName(e.target.value, index, message.key);
                        }
                      }}
                    />
                    <button
                      onClick={() =>
                        handleUserName(
                          document.querySelector('input[type="text"]').value,
                          index,
                          message.key
                        )
                      }
                    >
                      Submit
                    </button>
                  </div>
                </div>
              )}
              {message.userNumber && (
                <div id="trying">
                  <div id={emptyInputArea ? "input_empty" : "input_one"}>
                    <input
                      type="number"
                      placeholder="Phone number..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          getUserNumber(e.target.value, index, message.key);
                        }
                      }}
                    />
                    <button
                      onClick={() =>
                        getUserNumber(
                          document.querySelector('input[type="number"]').value,
                          index,
                          message.key
                        )
                      }
                    >
                      Submit
                    </button>
                  </div>
                </div>
              )}
              {message.input && (
                <div id="trying">
                  <div id={emptyGuest ? "input_empty" : "input_one"}>
                    <input
                      type="number"
                      placeholder="Enter number of guests"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleInputSubmit(e.target.value, index, message.key);
                        }
                      }}
                    />
                    <button
                      onClick={() =>
                        handleInputSubmit(
                          document.querySelector('input[type="number"]').value,
                          index,
                          message.key
                        )
                      }
                    >
                      Submit
                    </button>
                  </div>
                </div>
              )}
              {message.threeInputs && (
                <div id="input_two">
                  <input
                    type="text"
                    placeholder="Enter your name"
                    onChange={(e) => {
                      threeInputs(e.target.value, "name");
                    }}
                  />
                  <input
                    type="number"
                    placeholder="Your event id"
                    onChange={(e) => {
                      threeInputs(e.target.value, "event_id");
                    }}
                  />
                  <input
                    type="text"
                    id="conern_field"
                    placeholder="Your concern"
                    onChange={(e) => {
                      threeInputs(e.target.value, "concern");
                    }}
                  />
                  <button onClick={() => hideThreeInputs(index)}>Submit details</button>
                </div>
              )}
              {message.datePicker && (
                <div id="pick_date">
                  <DatePicker
                    headerBackgroundColor={"#e42978"}
                    selected={startDate}
                    onChange={(date) => handleDateSelect(date, index)}
                    customInput={<ExampleCustomInput />}
                  />
                </div>
              )}
              {message.preferredAreaInput && (
                <div id="trying">
                  <div id={emptyInputArea ? "input_empty" : "input_one"}>
                    <input
                      type="text"
                      placeholder="Enter preferred area"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAreaInputSubmit(e.target.value, index);
                        }
                      }}
                    />
                    <button
                      onClick={() =>
                        handleAreaInputSubmit(
                          document.querySelector('input[type="text"]').value,
                          index
                        )
                      }
                    >
                      Submit
                    </button>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          ))}
        </div>
      )}
      <div id="trying" className="ty87">
        <div id="input_one">
          <input type="number" placeholder="Please wait..." disabled />
          <button>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
