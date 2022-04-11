import { signOut } from 'next-auth/react';

import { isGovOfficer } from '../libs/govAccount';
import MyContribution from './myContribution';
import MyVote from './myVote';

export default function LoggedProfile({ user }) {
  return (
    <div className="container mx-auto">
      <div className="md:flex no-wrap md:-mx-2 ">
        <div className="w-full md:w-3/12 md:mx-2">
          <div className="bg-white p-3 border-t-4 border-green-400">
            <div className="image overflow-hidden">
              {user.image ? (
                <img
                  className="h-auto w-full mx-auto"
                  alt={user.name}
                  title={user.name}
                  src={user.image}
                />
              ) : (
                <svg
                  fill="currentColor"
                  viewBox="0 0 512 512"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="#C7E5F4"
                    d="M256,238.428c-65.735,0-119.214-53.48-119.214-119.214S190.265,0,256,0
		c65.734,0,119.214,53.48,119.214,119.214S321.734,238.428,256,238.428z"
                  />
                  <path
                    fill="#C7E5F4"
                    d="M414.229,512H97.771c-10.687,0-19.351-8.664-19.351-19.351v-61.375
		c0-97.918,79.662-177.58,177.58-177.58s177.58,79.662,177.58,177.58v61.375C433.58,503.336,424.916,512,414.229,512z"
                  />
                  <path
                    fill="#60BFE1"
                    d="M256,0v238.428c65.734,0,119.214-53.48,119.214-119.214C375.214,53.478,321.734,0,256,0z"
                  />
                  <path
                    fill="#60BFE1"
                    d="M256,253.693V512h158.229c10.687,0,19.351-8.664,19.351-19.351v-61.375
		C433.58,333.355,353.918,253.693,256,253.693z"
                  />
                </svg>
              )}
            </div>
            <h1 className="text-gray-900 font-bold text-xl leading-8 my-1">
              {user.name}
            </h1>
            <h3 className="text-gray-600 font-lg text-semibold leading-6">
              {user.email}
            </h3>
            <ul className="bg-gray-100 text-gray-600 px-3 mt-3 divide-y rounded shadow-sm">
              {isGovOfficer(user) ? (
                <li className="flex gap-1 items-center py-3">
                  <span>ผู้ใช้</span>
                  <span className="ml-auto">เจ้าหน้าที่รัฐ</span>
                </li>
              ) : (
                <button
                  className="block w-full text-purple-500 bg-purple-50 text-sm rounded-lg hover:bg-purple-100 focus:outline-none focus:shadow-outline focus:bg-purple-200 hover:shadow-xs p-3 my-4"
                  onClick={() => {
                    alert('aaa');
                  }}
                >
                  ผู้ใช้ของภาครัฐ?
                </button>
              )}
            </ul>
            {/* <p className="text-sm text-gray-500 hover:text-gray-600 leading-6">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Reprehenderit, eligendi dolorum sequi illum qui unde aspernatur
              non deserunt
            </p> */}
            {/*
              <li className="flex gap-1 items-center py-3">
                <span>Status</span>
                <span className="ml-auto">
                  <span className="bg-green-500 py-1 px-2 rounded text-white text-sm">
                    Active
                  </span>
                </span>
              </li>
              <li className="flex gap-1 items-center py-3">
                <span>Member since</span>
                <span className="ml-auto">Nov 07, 2016</span>
              </li>
            </ul> */}

            <button
              className="block w-full text-blue-800 text-sm font-semibold rounded-lg hover:bg-gray-100 focus:outline-none focus:shadow-outline focus:bg-gray-100 hover:shadow-xs p-3 my-4"
              onClick={() => {
                signOut();
              }}
            >
              Log out
            </button>
          </div>

          <div className="my-4"></div>
        </div>

        <div className="min-h-64 h-full w-full md:w-9/12 mx-2">
          {/* <div className="bg-white p-3 shadow-sm rounded-sm">
            <div className="flex gap-1 items-center space-x-2 font-semibold text-gray-900 leading-8">
              <span className="text-green-500">
                <svg
                  className="h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </span>
              <span className="tracking-wide">About</span>
            </div>

            <div className="text-gray-700">
              <div className="grid md:grid-cols-2 text-sm">
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2 font-semibold">Email</div>
                  <div className="px-4 py-2">{user.email}</div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2 font-semibold">Last Name</div>
                  <div className="px-4 py-2">Doe</div>
                </div>
              </div>
            </div>
            <div className="text-gray-700">
              <div className="grid md:grid-cols-2 text-sm">
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2 font-semibold">First Name</div>
                  <div className="px-4 py-2">Jane</div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2 font-semibold">Last Name</div>
                  <div className="px-4 py-2">Doe</div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2 font-semibold">Gender</div>
                  <div className="px-4 py-2">Female</div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2 font-semibold">Contact No.</div>
                  <div className="px-4 py-2">+11 998001001</div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2 font-semibold">Current Address</div>
                  <div className="px-4 py-2">Beech Creek, PA, Pennsylvania</div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2 font-semibold">
                    Permanant Address
                  </div>
                  <div className="px-4 py-2">
                    Arlington Heights, IL, Illinois
                  </div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2 font-semibold">Email.</div>
                  <div className="px-4 py-2">
                    <a className="text-blue-800" href="mailto:jane@example.com">
                      jane@example.com
                    </a>
                  </div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2 font-semibold">Birthday</div>
                  <div className="px-4 py-2">Feb 06, 1998</div>
                </div>
              </div>
            </div>
            <button className="block w-full text-blue-800 text-sm font-semibold rounded-lg hover:bg-gray-100 focus:outline-none focus:shadow-outline focus:bg-gray-100 hover:shadow-xs p-3 my-4">
              Show Full Information
            </button>
          </div> */}

          {/* <div className="my-4"></div> */}

          <div className="bg-white p-3 shadow-sm rounded-sm">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="mb-4">
                <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3">
                  <span className="text-green-500">
                    <svg
                      className="h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </span>
                  <span className="tracking-wide">รายการที่โหวด</span>
                </div>
                <MyVote />
              </div>

              <div>
                <div className="flex gap-1 items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3">
                  <span className="text-green-500">
                    <svg
                      className="h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path fill="#fff" d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path
                        fill="#fff"
                        d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                      />
                    </svg>
                  </span>
                  <span className="tracking-wide">รายการเพิ่ม</span>
                </div>
                <MyContribution />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="m-20"></div>
    </div>
  );
}
