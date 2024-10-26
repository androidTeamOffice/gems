import React from "react";
import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";


// Styles for the PDF document
const styles = {
    page: {
        padding: 30,
        backgroundColor: "#ffffff",
        fontFamily: "Helvetica",
        fontSize: 11,
        color: "#333",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        borderBottom: "1px solid #333",
        paddingBottom: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#222",
        textTransform: "uppercase",
    },
    sectionHeader: {
        textAlign: 'center',
        marginVertical: 10,
        fontWeight: 'bold',
        fontSize: 14,
        color: "#444",
        borderBottom: "1px solid #ccc",
        paddingBottom: 5,
    },
    tableRow: {
        flexDirection: "row",
        margin: 2,
        alignItems: "center",
    },
    tableCell: {
        fontSize: 10,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        flex: 1,
        textAlign: "left",
        margin:2,
        backgroundColor: "#f9f9f9",
    },
    lastCell: {
        borderRightWidth: 0,
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 5,
        marginVertical: 15,
        alignSelf: "center",
        objectFit: "cover",
        borderWidth: "4px solid #808080",
    },
    boldText: {
        fontWeight: "bold",
    },
};






const PDF = ({ data, contactsShown, noksShown, contactsCheck, noksCheck, bioDatasCheck }) => {
    



    // Function to render each bio data entry on a separate page
    const renderBioData = (bio) => (
        <View>
            {/* Bio Data Section */}
            {bioDatasCheck && (
                <>
                    <Text style={[styles.sectionHeader, styles.boldText]}>Bio Data</Text>
                    {bio.img ? (
                        <Image style={styles.image} src={bio.img} />
                    ) : (
                        <Text style={[styles.tableCell, { textAlign: "center", backgroundColor: "transparent", borderColor: "transparent" }]}>
                            No Image Available
                        </Text>
                    )}
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCell, styles.boldText]}>Army No: {bio.Army_No}</Text>
                        <Text style={[styles.tableCell]}>Indl Name: {bio.indlName}</Text>
                        <Text style={[styles.tableCell, styles.lastCell]}>Rank: {bio.rank}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCell]}>Trade: {bio.trade}</Text>
                        <Text style={[styles.tableCell]}>CNIC: {bio.cnic}</Text>
                        <Text style={[styles.tableCell, styles.lastCell]}>Bty: {bio.bty}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCell]}>Father Name: {bio.fatherName}</Text>
                        <Text style={[styles.tableCell]}>Medical Category: {bio.medicalCategory}</Text>
                        <Text style={[styles.tableCell, styles.lastCell]}>Bdr Dist: {bio.bdrDist}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCell]}>Sect: {bio.sect}</Text>
                        <Text style={[styles.tableCell]}>Marital Status: {bio.maritalStatus}</Text>
                        <Text style={[styles.tableCell, styles.lastCell]}>Qual Status: {bio.qualStatus}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCell]}>Blood Gp: {bio.bloodGp}</Text>
                        <Text style={[styles.tableCell]}>Cl Cast: {bio.ciCast}</Text>
                        <Text style={[styles.tableCell, styles.lastCell]}>SVC Bkt Yr: {bio.svcBktYr}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCell]}>Total Svc: {bio.totalSvc}</Text>
                        <Text style={[styles.tableCell]}>Remaining Svc: {bio.remainingSvc}</Text>
                        <Text style={[styles.tableCell, styles.lastCell]}>DOB: {bio.dob}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCell]}>DOE: {bio.doe}</Text>
                        <Text style={[styles.tableCell]}>TOS: {bio.tos}</Text>
                        <Text style={[styles.tableCell, styles.lastCell]}>SOS: {bio.sos}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCell]}>Civ Education: {bio.civEducation}</Text>
                        <Text style={[styles.tableCell]}>DOPR: {bio.dopr}</Text>
                        <Text style={[styles.tableCell, styles.lastCell]}>DOPR: {bio.dopr}</Text>
                    </View>
                </>
            )}
            {/* Contacts Section */}
            {contactsShown && contactsCheck && bio.contacts.length > 0 && (
                <>
                    <Text style={[styles.sectionHeader,styles.boldText]}>Contacts</Text>
                    {bio.contacts.map((contact, i) => (
                        <View key={i} style={styles.tableRow}>
                            <Text style={[styles.tableCell]}>
                                <Text style={{ fontWeight: "bold" }}>Contact:</Text> {contact.Contact_No}
                            </Text>
                            <Text style={[styles.tableCell]}>Teh: {contact.Teh}</Text>
                            <Text style={[styles.tableCell, styles.lastCell]}>Dist: {contact.Dist}</Text>
                        </View>
                    ))}
                </>
            )}
            {/* NOKs Section */}
            {noksShown && noksCheck && bio.noks.length > 0 && (
                <>
                    <Text style={[styles.sectionHeader, styles.boldText]}>Next of Kin</Text>
                    {bio.noks.map((nok, i) => (
                        <View key={i} style={styles.tableRow}>
                            <Text style={[styles.tableCell]}>
                                <Text style={{ fontWeight: "bold" }}>Contact:</Text> {nok.Contact_No}
                            </Text>
                            <Text style={[styles.tableCell]}>Teh: {nok.Teh}</Text>
                            <Text style={[styles.tableCell, styles.lastCell]}>Dist: {nok.Dist}</Text>
                        </View>
                    ))}
                </>
            )}
        </View>
    );

    return (
        <Document>
            {data.map((bio, index) => (
                <Page key={index} size="A4" orientation="landscape" style={styles.page}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Report</Text>
                    </View>
                    {renderBioData(bio)}
                </Page>
            ))}
        </Document>
    );
};

export default PDF;
