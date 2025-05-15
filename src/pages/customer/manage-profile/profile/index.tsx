"use client";

import { Badge } from "@/components/ui/badge";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Phone, Lock, Edit, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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

const Profile = () => {
  const { getAddresses } = CustomerService();
  const { getReputation } = ReputationService();
  const { getProfile } = useAuthService();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [profile, setProfile] = useState<Profile>();
  const [reputaion, setReputation] = useState<Reputation>();

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
            <CardDescription>Member since January 2023</CardDescription>
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
                Change Password
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Activity and Orders */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Account Activity</CardTitle>
            <CardDescription>Your recent orders and activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Recent Orders</h3>
                <Separator className="my-2" />
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Điểm uy tín: {reputaion?.currentScore}</p>
                      <p className="text-sm text-muted-foreground">
                        2 items • April 12, 2023
                      </p>
                    </div>
                    <Badge variant="outline">Delivered</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Order #12346</p>
                      <p className="text-sm text-muted-foreground">
                        1 item • March 24, 2023
                      </p>
                    </div>
                    <Badge variant="outline">Delivered</Badge>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium">Wishlist</h3>
                <Separator className="my-2" />
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">
                        Baby Three - Special Edition
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Added on May 3, 2023
                      </p>
                    </div>
                    <Button size="sm">Add to Cart</Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Labubu Dragon Edition</p>
                      <p className="text-sm text-muted-foreground">
                        Added on April 18, 2023
                      </p>
                    </div>
                    <Button size="sm">Add to Cart</Button>
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
