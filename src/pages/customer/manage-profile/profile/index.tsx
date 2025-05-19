"use client";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Phone, Lock, Edit, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import GetAddress from "../../manage-address/address";
import CreateAddress from "../../manage-address/create-address";
import CustomerService from "@/services/CustomerService";
import useAuthService from "@/services/AuthService";
import ReputationService from "@/services/ReputationService";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { RoleVietnamese } from "@/components/utils";

const Profile = () => {
  const { getAddresses } = CustomerService();
  const { getReputation } = ReputationService();
  const { getProfile } = useAuthService();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [profile, setProfile] = useState<Profile>();
  const [reputaion, setReputation] = useState<Reputation>();
const userInfo = useSelector((state: RootState) => state.user);
  useEffect(() => {
    fetchAddresses();
    fetchProfile();
    fetchReputation();
  }, []);

  const fetchReputation = async () => {
    const response = await getReputation()
    if (response) {
     setReputation(response.responseRequestModel)
      console.log("response.responseRequestModel: ", response.responseRequestModel)
    }
  }

  const fetchAddresses = useCallback(async () => {
    const res = await getAddresses({});
    const items = res?.responseRequestModel?.responseList?.items || [];
    setAddresses(items);
    console.log("items: ", items)
  }, [getAddresses]);

  const fetchProfile = async () => {
    const response = await getProfile()
    if (response) {
      setProfile(response.responseRequestModel)
      console.log("response.responseRequestModel: ", response.responseRequestModel)
    }
  }

  const [user] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, Anytown, USA",
    avatar: "/placeholder-avatar.jpg",
  });

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4 relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar} alt={profile?.fullName} />
                <AvatarFallback>
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="outline"
                className="absolute bottom-0 right-1/3 h-8 w-8 rounded-full"
              >
                <Camera className="h-4 w-4" />
                <span className="sr-only">Change avatar</span>
              </Button>
            </div>
            <CardTitle>{profile?.fullName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{profile?.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{profile?.phoneNumber}</span>
              </div>
            </div>
          </CardContent>

          {/* Address */}
          <GetAddress addresses={addresses} onUpdated={fetchAddresses} />
          <CreateAddress
            onCreated={fetchAddresses}
            addresses={addresses || []}
          />

          <CardFooter className="flex flex-col gap-2">
            <Button variant="outline" className="w-full" asChild>
              <Link
                to="/edit-profile"
                className="flex items-center justify-center"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link
                to="/change-password"
                className="flex items-center justify-center"
              >
                <Lock className="mr-2 h-4 w-4" />
               Đổi mật khẩu
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Activity and Orders */}
        <Card className="md:col-span-2">
          <CardHeader>
            {/* <CardTitle>Account Activity</CardTitle>
            <CardDescription>Your recent orders and activity</CardDescription> */}
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <Separator className="my-2" />
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Điểm uy tín: {reputaion?.currentScore}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Vai trò: {RoleVietnamese(userInfo.role)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
