"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var pool = require('../db/db'); // Assuming the file is named db.js


function fetchAppointmentSlots(currentDay) {
  var connection, sql, _ref, _ref2, rows;

  return regeneratorRuntime.async(function fetchAppointmentSlots$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(pool.getConnection());

        case 2:
          connection = _context.sent;
          _context.prev = 3;
          sql = "\n    SELECT Appointment_Time, COUNT(*) as bookings \n    FROM civdatas \n    WHERE Appointment_Day = ? \n    GROUP BY Appointment_Time\n";
          _context.next = 7;
          return regeneratorRuntime.awrap(pool.query(sql, [currentDay]));

        case 7:
          _ref = _context.sent;
          _ref2 = _slicedToArray(_ref, 1);
          rows = _ref2[0];
          return _context.abrupt("return", rows || null);

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](3);
          console.error('Error fetching appointment time slots from database:', _context.t0);
          throw _context.t0;

        case 17:
          _context.prev = 17;
          connection.release();
          return _context.finish(17);

        case 20:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 13, 17, 20]]);
}

; // Function to add a civData to the MySQL database

function addCivDataToDatabase(civData) {
  var connection, sql, _ref3, _ref4, results;

  return regeneratorRuntime.async(function addCivDataToDatabase$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(pool.getConnection());

        case 2:
          connection = _context2.sent;
          _context2.prev = 3;
          sql = "INSERT INTO civdatas(\n            `name`,`userId`, `cnic`, `occupation`, `category`, `type`, `status`, `remarks`,\n            `Card_Duration`, `Vehicle_Registration_No`, `Mobile_no`, `Home_phone_no`,\n            `FCNIC`, `Father_Husband_Name`, `Gaurdian_Contact`, `Gaurdian_CNIC`, \n            `Gaurdian_Occupation`,  `Present_Address`, \n            `Permanent_Address`, `Profile_Picture`, `Disability`, `Description`, \n            `Vehicle_Make`, `Vehicle_Model`, `Vehicle_Type`, `Previous_Card_Picture`, `BCNIC`, `Vehicle_Documents`,\n            `Police_Verification_Document`, `Appointment_Day`, `Appointment_Time`\n          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)";
          _context2.next = 7;
          return regeneratorRuntime.awrap(connection.execute(sql, [civData.name, civData.userid, civData.cnic, civData.occupation, civData.category, civData.type, "New", civData.remarks, civData.Card_Duration, civData.Vehicle_Registration_No, civData.Mobile_no, civData.Home_phone_no, civData.fCNIC, civData.Father_Husband_Name, civData.Gaurdian_Contact, civData.Gaurdian_CNIC, civData.Gaurdian_Occupation, civData.Present_Address, civData.Permanent_Address, civData.Profile_Picture, civData.Disability, civData.Description, civData.Vehicle_Make, civData.Vehicle_Model, civData.Vehicle_Type, civData.Previous_Card_Picture, civData.bCNIC, civData.Vehicle_Documents, civData.Police_Verification_Document, civData.Appointment_Day, civData.Appointment_Time]));

        case 7:
          _ref3 = _context2.sent;
          _ref4 = _slicedToArray(_ref3, 1);
          results = _ref4[0];
          civData.id = results.insertId; // Set the generated ID on the user object

          _context2.next = 17;
          break;

        case 13:
          _context2.prev = 13;
          _context2.t0 = _context2["catch"](3);
          console.error('Error adding civData to database:', _context2.t0);
          throw _context2.t0;

        case 17:
          _context2.prev = 17;
          connection.release();
          return _context2.finish(17);

        case 20:
          return _context2.abrupt("return", civData);

        case 21:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[3, 13, 17, 20]]);
}

;

var saveDisabledDatesToDatabase = function saveDisabledDatesToDatabase(dates) {
  var values, query;
  return regeneratorRuntime.async(function saveDisabledDatesToDatabase$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          // Use parameterized query to avoid SQL injection
          values = dates.map(function () {
            return "?";
          }).join(",");
          query = "INSERT INTO disabled_dates (date) VALUES (".concat(values, ")");
          console.log("value : ", values);
          console.log("query : ", query); // Execute the query with date values as parameters

          _context3.next = 7;
          return regeneratorRuntime.awrap(pool.query(query, dates));

        case 7:
          _context3.next = 13;
          break;

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          console.error("Database error while saving dates:", _context3.t0);
          throw new Error("Database error while saving dates");

        case 13:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

function findCivDataByCNIC(cnic) {
  var _ref5, _ref6, rows;

  return regeneratorRuntime.async(function findCivDataByCNIC$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(pool.query('SELECT * FROM civdatas WHERE cnic = ?', [cnic]));

        case 3:
          _ref5 = _context4.sent;
          _ref6 = _slicedToArray(_ref5, 1);
          rows = _ref6[0];
          return _context4.abrupt("return", rows[0] || null);

        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4["catch"](0);
          console.error('Error finding user by cnic:', _context4.t0); // You can also throw a specific error here for handling in the route handler

        case 12:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 9]]);
}

;

function findCivDataById(id) {
  var _ref7, _ref8, rows;

  return regeneratorRuntime.async(function findCivDataById$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(pool.query('SELECT * FROM civdatas WHERE id = ?', [id]));

        case 3:
          _ref7 = _context5.sent;
          _ref8 = _slicedToArray(_ref7, 1);
          rows = _ref8[0];
          return _context5.abrupt("return", rows[0] || null);

        case 9:
          _context5.prev = 9;
          _context5.t0 = _context5["catch"](0);
          console.error('Error finding civData by id:', _context5.t0); // You can also throw a specific error here for handling in the route handler

        case 12:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 9]]);
}

;

function getAllCivDatas() {
  var _ref9, _ref10, rows;

  return regeneratorRuntime.async(function getAllCivDatas$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(pool.query("SELECT * FROM civdatas where status = 'New'"));

        case 3:
          _ref9 = _context6.sent;
          _ref10 = _slicedToArray(_ref9, 1);
          rows = _ref10[0];
          console.log("fetched civDatas");
          return _context6.abrupt("return", rows);

        case 10:
          _context6.prev = 10;
          _context6.t0 = _context6["catch"](0);
          console.error('Error fetching all civDatas:', _context6.t0); // You can also throw a specific error here for handling in the route handler

        case 13:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 10]]);
}

;

function getAllDisabledDates() {
  var _ref11, _ref12, rows;

  return regeneratorRuntime.async(function getAllDisabledDates$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap(pool.query("SELECT * FROM disabled_dates"));

        case 3:
          _ref11 = _context7.sent;
          _ref12 = _slicedToArray(_ref11, 1);
          rows = _ref12[0];
          console.log("fetched disabled dates.");
          return _context7.abrupt("return", rows);

        case 10:
          _context7.prev = 10;
          _context7.t0 = _context7["catch"](0);
          console.error('Error fetching all civDatas:', _context7.t0); // You can also throw a specific error here for handling in the route handler

        case 13:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 10]]);
}

;

function getAllVerifiedCivDatas() {
  var _ref13, _ref14, rows;

  return regeneratorRuntime.async(function getAllVerifiedCivDatas$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return regeneratorRuntime.awrap(pool.query("SELECT * FROM civdatas where status <> 'New'"));

        case 3:
          _ref13 = _context8.sent;
          _ref14 = _slicedToArray(_ref13, 1);
          rows = _ref14[0];
          console.log("fetched civDatas");
          return _context8.abrupt("return", rows);

        case 10:
          _context8.prev = 10;
          _context8.t0 = _context8["catch"](0);
          console.error('Error fetching all civDatas:', _context8.t0); // You can also throw a specific error here for handling in the route handler

        case 13:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 10]]);
}

;

function deleteCivData(id) {
  var sql, result;
  return regeneratorRuntime.async(function deleteCivData$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          sql = "DELETE FROM civdatas WHERE id = ?";
          _context9.next = 4;
          return regeneratorRuntime.awrap(pool.execute(sql, [id]));

        case 4:
          result = _context9.sent;

          if (!(result[0].affectedRows === 0)) {
            _context9.next = 7;
            break;
          }

          return _context9.abrupt("return", false);

        case 7:
          return _context9.abrupt("return", true);

        case 10:
          _context9.prev = 10;
          _context9.t0 = _context9["catch"](0);
          console.error('Error deleting civDatas:', _context9.t0); // You can also throw a specific error here for handling in the route handler

        case 13:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 10]]);
}

;

function rejectCivData(id, remarks) {
  var sql, result;
  return regeneratorRuntime.async(function rejectCivData$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          sql = "update civdatas set status='Rejected' , remarks=? WHERE id = ?";
          _context10.next = 4;
          return regeneratorRuntime.awrap(pool.execute(sql, [remarks, id]));

        case 4:
          result = _context10.sent;

          if (!(result[0].affectedRows === 0)) {
            _context10.next = 7;
            break;
          }

          return _context10.abrupt("return", false);

        case 7:
          return _context10.abrupt("return", true);

        case 10:
          _context10.prev = 10;
          _context10.t0 = _context10["catch"](0);
          console.error('Error deleting civDatas:', _context10.t0); // You can also throw a specific error here for handling in the route handler

        case 13:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 10]]);
}

;

function verifyCivData(id) {
  var sql, result;
  return regeneratorRuntime.async(function verifyCivData$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          sql = "update civdatas set status='Verified', remarks='' WHERE id = ?";
          _context11.next = 4;
          return regeneratorRuntime.awrap(pool.execute(sql, [id]));

        case 4:
          result = _context11.sent;

          if (!(result[0].affectedRows === 0)) {
            _context11.next = 7;
            break;
          }

          return _context11.abrupt("return", false);

        case 7:
          return _context11.abrupt("return", true);

        case 10:
          _context11.prev = 10;
          _context11.t0 = _context11["catch"](0);
          console.error('Error verifyCivData civDatas:', _context11.t0); // You can also throw a specific error here for handling in the route handler

        case 13:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 10]]);
}

;

function verifyStatus(id) {
  var sql, result;
  return regeneratorRuntime.async(function verifyStatus$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          sql = "SELECT status FROM civDatas WHERE userId = ? ORDER BY Appointment_Day DESC LIMIT 1";
          _context12.next = 4;
          return regeneratorRuntime.awrap(pool.execute(sql, [id]));

        case 4:
          result = _context12.sent;
          return _context12.abrupt("return", result);

        case 8:
          _context12.prev = 8;
          _context12.t0 = _context12["catch"](0);
          console.error('Error status civDatas:', _context12.t0); // You can also throw a specific error here for handling in the route handler

        case 11:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[0, 8]]);
}

; // Function to update a civData in the MySQL database

function updateCivDataInDatabase(id, updatedCivData) {
  var connection, sql, _ref15, _ref16, results;

  return regeneratorRuntime.async(function updateCivDataInDatabase$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.next = 2;
          return regeneratorRuntime.awrap(pool.getConnection());

        case 2:
          connection = _context13.sent;
          _context13.prev = 3;
          sql = "UPDATE civdatas SET name = ? WHERE id = ?";
          _context13.next = 7;
          return regeneratorRuntime.awrap(connection.execute(sql, [updatedCivData.name, id]));

        case 7:
          _ref15 = _context13.sent;
          _ref16 = _slicedToArray(_ref15, 1);
          results = _ref16[0];

          if (!(results.affectedRows === 0)) {
            _context13.next = 12;
            break;
          }

          throw new Error('CivData not found');

        case 12:
          _context13.next = 18;
          break;

        case 14:
          _context13.prev = 14;
          _context13.t0 = _context13["catch"](3);
          console.error('Error updating civData in database:', _context13.t0);
          throw _context13.t0;

        case 18:
          _context13.prev = 18;
          connection.release();
          return _context13.finish(18);

        case 21:
        case "end":
          return _context13.stop();
      }
    }
  }, null, null, [[3, 14, 18, 21]]);
}

;
module.exports = {
  addCivDataToDatabase: addCivDataToDatabase,
  saveDisabledDatesToDatabase: saveDisabledDatesToDatabase,
  findCivDataByCNIC: findCivDataByCNIC,
  findCivDataById: findCivDataById,
  updateCivDataInDatabase: updateCivDataInDatabase,
  getAllCivDatas: getAllCivDatas,
  getAllVerifiedCivDatas: getAllVerifiedCivDatas,
  deleteCivData: deleteCivData,
  rejectCivData: rejectCivData,
  verifyCivData: verifyCivData,
  verifyStatus: verifyStatus,
  getAllDisabledDates: getAllDisabledDates,
  fetchAppointmentSlots: fetchAppointmentSlots
};