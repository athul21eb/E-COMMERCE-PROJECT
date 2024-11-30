import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { addressSchema } from "../../../utils/validation/userAddressValidationSchema";
import PropTypes from "prop-types";

const AddressForm = ({ initialValues, onSubmit }) => {

 

  const formik = useFormik({
    enableReinitialize: true, // This ensures formik updates when initialValues change
    initialValues: initialValues || {
      firstName: "",
      lastName: "",
      state: "",
      district: "",
      city: "",
      pincode: "",
      landmark: "",
      mobileNumber: "",
      alternateNumber: "",
    },
    validationSchema:addressSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
        {initialValues ? "Update Address" : "Add New Address"}
      </h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...formik.getFieldProps("firstName")}
            />
            {formik.touched.firstName && formik.errors.firstName ? (
              <div className="text-red-500 text-sm">
                {formik.errors.firstName}
              </div>
            ) : null}
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...formik.getFieldProps("lastName")}
            />
            {formik.touched.lastName && formik.errors.lastName ? (
              <div className="text-red-500 text-sm">
                {formik.errors.lastName}
              </div>
            ) : null}
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1">
              State
            </label>
            <input
              type="text"
              name="state"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...formik.getFieldProps("state")}
            />
            {formik.touched.state && formik.errors.state ? (
              <div className="text-red-500 text-sm">{formik.errors.state}</div>
            ) : null}
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1">
              District
            </label>
            <input
              type="text"
              name="district"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...formik.getFieldProps("district")}
            />
            {formik.touched.district && formik.errors.district ? (
              <div className="text-red-500 text-sm">
                {formik.errors.district}
              </div>
            ) : null}
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1">
              City
            </label>
            <input
              type="text"
              name="city"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...formik.getFieldProps("city")}
            />
            {formik.touched.city && formik.errors.city ? (
              <div className="text-red-500 text-sm">{formik.errors.city}</div>
            ) : null}
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Pincode
            </label>
            <input
              type="text"
              name="pincode"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...formik.getFieldProps("pincode")}
            />
            {formik.touched.pincode && formik.errors.pincode ? (
              <div className="text-red-500 text-sm">
                {formik.errors.pincode}
              </div>
            ) : null}
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Landmark (Optional)
            </label>
            <input
              type="text"
              name="landmark"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...formik.getFieldProps("landmark")}
            />
            {formik.touched.landmark && formik.errors.landmark ? (
              <div className="text-red-500 text-sm">
                {formik.errors.landmark}
              </div>
            ) : null}
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Mobile Number
            </label>
            <input
              type="text"
              name="mobileNumber"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...formik.getFieldProps("mobileNumber")}
            />
            {formik.touched.mobileNumber && formik.errors.mobileNumber ? (
              <div className="text-red-500 text-sm">
                {formik.errors.mobileNumber}
              </div>
            ) : null}
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Alternate Number (Optional)
            </label>
            <input
              type="text"
              name="alternateNumber"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...formik.getFieldProps("alternateNumber")}
            />
            {formik.touched.alternateNumber && formik.errors.alternateNumber ? (
              <div className="text-red-500 text-sm">
                {formik.errors.alternateNumber}
              </div>
            ) : null}
          </div>
        </div>
        <button
          type="submit"
          className="mt-6 w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {initialValues ? "Update Address" : "Save  Address"}
        </button>
      </form>
    </div>
  );
};


AddressForm.propTypes = {
  initialValues: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    state: PropTypes.string,
    district: PropTypes.string,
    city: PropTypes.string,
    pincode: PropTypes.string,
    landmark: PropTypes.string,
    mobileNumber: PropTypes.string, // `mobileNumber` seems essential
    alternateNumber: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired, // `onSubmit` should always be a function
};

export default AddressForm;
