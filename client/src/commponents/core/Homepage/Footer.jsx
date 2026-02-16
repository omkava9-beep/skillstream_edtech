import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaGoogle, FaYoutube } from "react-icons/fa";
import { FooterLink2 } from "../../../data/footer-links";
import { apiConnector } from "../../../../services/apiConnector";
import { catagories } from "../../../../services/apis";

const BottomFooter = ["Privacy Policy", "Cookie Policy", "Terms"];
const Resources = [
    "Articles",
    "Blog",
    "Chart Sheet",
    "Code challenges",
    "Docs",
    "Projects",
    "Videos",
    "Workspaces",
];
const Plans = ["Paid memberships", "For students", "Business solutions"];
const Community = ["Forums", "Chapters", "Events"];

const Footer = () => {
    const [subLinks, setSubLinks] = React.useState([]);

    React.useEffect(() => {
        const fetchSublinks = async () => {
            try {
                const result = await apiConnector("GET", catagories.CATAGORIES_API);
                console.log("FOOTER CATEGORIES RESULT:", result);
                setSubLinks(result.data.data);
            } catch (error) {
                console.log("Could not fetch the category list:", error);
            }
        };
        fetchSublinks();
    }, []);

    return (
        <div className="bg-richblack-800 border-t border-richblack-700">
            <div className="flex lg:flex-row gap-8 items-center justify-between w-full px-4 sm:px-6 lg:px-12 xl:px-20 text-richblack-400 leading-6 mx-auto relative py-14">
                <div className="border-b w-full flex flex-col lg:flex-row pb-5 border-richblack-700">
                    {/* Section 1 */}
                    <div className="lg:w-[50%] flex flex-wrap flex-row justify-between lg:border-r lg:border-richblack-700 pl-3 lg:pr-5 gap-3">
                        <div className="w-[30%] flex flex-col gap-3 lg:w-[30%] mb-7 lg:pl-0">
                            <h1 className="text-richblack-50 font-semibold text-[16px]">
                                StudyNotion
                            </h1>
                            <div className="flex flex-col gap-2 mt-2">
                                {["About", "Careers", "Affiliates"].map((ele, i) => {
                                    const path = ele === "About" ? "/about" : "/";
                                    return (
                                        <div
                                            key={i}
                                            className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                                        >
                                            <Link to={path}>{ele}</Link>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex gap-3 text-lg mt-2">
                                <FaFacebook className="hover:text-blue-200 cursor-pointer transition-all duration-200" />
                                <FaGoogle className="hover:text-pink-200 cursor-pointer transition-all duration-200" />
                                <FaTwitter className="hover:text-blue-100 cursor-pointer transition-all duration-200" />
                                <FaYoutube className="hover:text-pink-300 cursor-pointer transition-all duration-200" />
                            </div>
                        </div>

                        <div className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
                            <h1 className="text-richblack-50 font-semibold text-[16px]">
                                Resources
                            </h1>
                            <div className="flex flex-col gap-2 mt-2">
                                {Resources.map((ele, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                                        >
                                            <Link to={"/"}>
                                                {ele}
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>
                            <h1 className="text-richblack-50 font-semibold text-[16px] mt-7">
                                Support
                            </h1>
                            <div className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200 mt-2">
                                <Link to={"/contact"}>Help Center</Link>
                            </div>
                        </div>

                        <div className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
                            <h1 className="text-richblack-50 font-semibold text-[16px]">
                                Plans
                            </h1>
                            <div className="flex flex-col gap-2 mt-2">
                                {Plans.map((ele, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                                        >
                                            <Link to={"/"}>
                                                {ele}
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>
                            <h1 className="text-richblack-50 font-semibold text-[16px] mt-7">
                                Community
                            </h1>
                            <div className="flex flex-col gap-2 mt-2">
                                {Community.map((ele, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                                        >
                                            <Link to={"/"}>
                                                {ele}
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Section 2 */}
                    <div className="lg:w-[50%] flex flex-wrap flex-row justify-between pl-3 lg:pl-5 gap-3">
                        {/* Dynamic Subjects from Backend */}
                        <div className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
                            <h1 className="text-richblack-50 font-semibold text-[16px]">
                                Subjects
                            </h1>
                            <div className="flex flex-col gap-2 mt-2">
                                {subLinks?.length > 0 ? (
                                    subLinks.slice(0, 10).map((ele, i) => (
                                        <Link 
                                            key={i} 
                                            to={`/catalog/${ele._id}`}
                                            className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                                        >
                                            {ele.name}
                                        </Link>
                                    ))
                                ) : (
                                    <div className="text-[14px] text-richblack-500 italic">
                                        No Subjects Found
                                    </div>
                                )}
                            </div>
                        </div>

                        {FooterLink2.map((ele, i) => {
                            if(ele.title === "Subjects") return null;
                            return (
                                <div key={i} className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
                                    <h1 className="text-richblack-50 font-semibold text-[16px]">
                                        {ele.title}
                                    </h1>
                                    <div className="flex flex-col gap-2 mt-2">
                                        {ele.links.map((link, index) => {
                                            const path = link.title === "Full Catalog" ? "/categories" : "/";
                                            return (
                                                <div
                                                    key={index}
                                                    className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                                                >
                                                    <Link to={path}>{link.title}</Link>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="flex flex-row items-center justify-between w-full px-4 sm:px-6 lg:px-12 xl:px-20 text-richblack-400 mx-auto pb-14 text-sm">
                {/* Section 1 */}
                <div className="flex justify-between lg:items-start items-center flex-col lg:flex-row gap-3 w-full">
                    <div className="flex flex-row">
                        {BottomFooter.map((ele, i) => {
                            return (
                                <div
                                    key={i}
                                    className={` ${
                                        BottomFooter.length - 1 === i
                                            ? ""
                                            : "border-r border-richblack-700 cursor-pointer hover:text-richblack-50 transition-all duration-200"
                                    } px-3 `}
                                >
                                    <Link to={"/"}>
                                        {ele}
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                    <div className="text-center font-medium">Made with ❤️ StudyNotion © {new Date().getFullYear()}</div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
