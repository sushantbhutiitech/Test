const userTypeDef = `#graphql

    scalar Upload

    type Query {
        users:User
        getUser(userId: ID!): User
    }

    type Mutation {
        signUp(body:userInput):User
    }
    type Mutation {
        Login(body:loginInput):User
        setupUserProfile(body:setuserprofileInput,file:Upload!):User
        # add interested domain
        addInterestedDomains(body: AddInterestedDomainsInput) : User

        # update user profile
        updateUserProfile(body: UpdateUserProfileInput, file: Upload): User
    } 
    type Mutation {
        forgetPassword(body:forgetPassword):Otp
    }

    type Mutation {
        submitOtp(body:submitOtpInput):Otp
    }

    type Mutation {
        changePassword(body:changePasswordInput):Otp
    }
    type User {
        token:String
        data:endUser
    }

    type endUser {
        _id:ID!
        firstName: String!
        socialMedia:Social
        username: String
        lastName: String
        email:String!
        role:String!
        otpExpiresAt:String
        otp: String
        reminders:Boolean
        isBlocked:Boolean
        intrestedDomains:[Domain!]!
        avatar:String
        country:String
        state:String
        city:String
        isRemindersOn:Boolean
        isAutoLogoutOn:Boolean
        rewardPoints:Int
        level:String
        phoneNumber: String
        followers:[ID!]
        following:[ ID!]
        gender:String,
        staticUrl:String
        dateOfBirth:String
    }

    type Domain {
        _id: ID
        name: String!
    }

    input userInput {
        firstName: String!
        socialMedia:socialInput
        lastName: String!
        email:String!
        password:String!
        role:String
        otpExpiresAt:String
        otp: String
        reminders:Boolean
        isBlocked:Boolean
        avatar:String
        country:String
        state:String
        city:String
        isRemindersOn:Boolean
        isAutoLogoutOn:Boolean
        rewardPoints:Int
        level:String
        followers:[ID!]
        following:[ ID!],
        gender:String,
        username:String
        phoneNumber:String
        dateOfBirth:String  
    }
    input socialInput {
      linkedIn: String
      instagram: String
      twitter:String
    
    }
 
    input submitOtpInput { 
        otp:String!
        email:String   
    }

    type Social {
        linkedIn:String
        instagram:String
        twitter:String
    }
    
    type Otp {
       message:String!
       success:Boolean!
    }


   input loginInput {
      email:String!
      password:String!
   }

   input forgetPassword {
      email:String!
   }

   input changePasswordInput {
     email:String!
     newPassword:String!
     confirmPassword:String!,
     otp:String!
   }
   type File {
        filename: String!
        mimetype: String!
        encoding: String!
        url:String!
    }

    input setuserprofileInput {
        firstName: String!
        lastName: String!
        country:String!
        state:String!
        gender:String!
        dateOfBirth:String!,
        phoneNumber:String!,
        username:String!
        staticUrl:String!

    }

  
   # here's the input for adding the domain
    input AddInterestedDomainsInput{
        domains: [DomainInput!]!
    }
    input DomainInput {
        _id: ID
        name: String!
    }

    #here' the input for updating the profile
    input UpdateUserProfileInput {
        firstName: String
        lastName: String
        country: String
        state: String
        city: String
        isRemindersOn: Boolean
        isAutoLogoutOn: Boolean
        rewardPoints: Int
        level: String
        followers: [ID!]
        following: [ID!]
        gender: String
        username: String
        phoneNumber: String
        dateOfBirth: String
        socialMedia: socialInput
    }
 
`;

module.exports = userTypeDef;
