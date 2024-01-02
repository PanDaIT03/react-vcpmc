import { collection, getDocs } from "firebase/firestore";
import { fireStoreDatabase } from "~/config/firebase";

export const getAuthorizedContract = async () => {
  const resultSnapshot = getDocs(collection(fireStoreDatabase, "contract"));
  const userList = await getDocs(collection(fireStoreDatabase, "users"));
  const roleList = await getDocs(collection(fireStoreDatabase, "roles"));

  return (await resultSnapshot).docs.map((doc) => {
    let createdBy = userList.docs.find(
      (user) => user.id === doc.data().createdBy
    );
    let authorizedUser = userList.docs.find(
      (user) => user.id === doc.data().authorizedPerson
    );
    const roleCreatedBy = roleList.docs.find(
      (role) => role.id === createdBy?.id
    );
    const roleAuthorizedUser = roleList.docs.find(
      (role) => role.id === authorizedUser?.id
    );

    return {
      docId: doc.id,
      authorized: doc.data().authorized,
      authorizedPerson: {
        docId: authorizedUser?.id || "",
        avatar: authorizedUser?.data().avatar || "",
        bank: authorizedUser?.data().bank || "",
        bankNumber: authorizedUser?.data().bankNumber || "",
        dateOfBirth: authorizedUser?.data().dateOfBirth || "",
        dateRange: authorizedUser?.data().dateRange || "",
        email: authorizedUser?.data().email || "",
        firstName: authorizedUser?.data().firstName || "",
        gender: authorizedUser?.data().gender || "",
        idNumber: authorizedUser?.data().idNumber || "",
        issuedBy: authorizedUser?.data().issuedBy || "",
        lastName: authorizedUser?.data().lastName || "",
        nationality: authorizedUser?.data().nationality || "",
        password: authorizedUser?.data().password || "",
        phoneNumber: authorizedUser?.data().phoneNumber || "",
        residence: authorizedUser?.data().residence || "",
        rolesId: authorizedUser?.data().rolesId || "",
        taxCode: authorizedUser?.data().taxCode || "",
        userName: authorizedUser?.data().userName || "",
        role: roleAuthorizedUser
          ? { docId: roleAuthorizedUser.id, name: roleAuthorizedUser.data().name }
          : { docId: "", name: "" },
        status: authorizedUser?.data().status,
        companyName: authorizedUser?.data().companyName,
      },
      authorizingLegalEntity: doc.data().authorizingLegalEntity,
      censored: doc.data().censored,
      contractCode: doc.data().contractCode,
      contractTypesId: doc.data().contractTypesId,
      createdBy: {
        avatar: createdBy?.data().avatar || "",
        bank: createdBy?.data().bank || "",
        bankNumber: createdBy?.data().bankNumber || "",
        dateOfBirth: createdBy?.data().dateOfBirth || "",
        dateRange: createdBy?.data().dateRange || "",
        email: createdBy?.data().email || "",
        firstName: createdBy?.data().firstName || "",
        gender: createdBy?.data().gender || "",
        idNumber: createdBy?.data().idNumber || "",
        issuedBy: createdBy?.data().issuedBy || "",
        lastName: createdBy?.data().lastName || "",
        nationality: createdBy?.data().nationality || "",
        password: createdBy?.data().password || "",
        phoneNumber: createdBy?.data().phoneNumber || "",
        residence: createdBy?.data().residence || "",
        rolesId: createdBy?.data().rolesId || "",
        taxCode: createdBy?.data().taxCode || "",
        userName: createdBy?.data().userName || "",
        roleDetails: roleCreatedBy
          ? { docId: roleCreatedBy.id, name: roleCreatedBy.data().name }
          : { docId: "", name: "" },
        docId: createdBy?.id || "",
        companyName: createdBy?.data().companyName,
      },
      customer: doc.data().customer,
      dateCreated: doc.data().dateCreated,
      effectiveDate: doc.data().effectiveDate,
      expirationDate: doc.data().expirationDate,
      ownerShips: doc.data().ownerShips,
      reason: doc.data().reason,
      status: doc.data().status,
      royalties: doc.data().royalties,
      CPM: doc.data().CPM,
      administrativeFee: doc.data().administrativeFee,
      forControlDate: doc.data().forControlDate,
    };
  });
};
