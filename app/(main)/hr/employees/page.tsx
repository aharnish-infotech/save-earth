"use client";
import React, { useState } from "react";
import Link from "next/link";

interface Employee {
  id: string; name: string; avatar: string; designation: string; department: string;
  email: string; role: string; reportingTo: string; status: "Active" | "Inactive";
  joining: string; longStanding?: boolean;
}

const PAGE_SIZE = 15;
const EMPLOYEES: Employee[] = [
  { id:"EMP-001", name:"Mukteshwar Sharma", avatar:"MS", designation:"CEO & Founder", department:"Management", email:"itsmukteshwar@gmail.com", role:"Super Admin", reportingTo:"—", joining:"01 Jan 2022", longStanding:true, status:"Active" as const },
  { id:"EMP-002", name:"Akash Rai", avatar:"AR", designation:"Sr. Developer", department:"Technology", email:"akash@zeroform.in", role:"Developer", reportingTo:"Mukteshwar Sharma", joining:"15 Mar 2022", longStanding:true, status:"Active" as const },
  { id:"EMP-003", name:"Harsh Mishra", avatar:"HM", designation:"Trainee", department:"Technology", email:"harsh@zeroform.in", role:"Viewer", reportingTo:"Akash Rai", joining:"01 Jun 2025", longStanding:false, status:"Active" as const },
  { id:"EMP-004", name:"Sanjana Goldar", avatar:"SG", designation:"Intern", department:"HR", email:"sanjana@zeroform.in", role:"Viewer", reportingTo:"Mukteshwar Sharma", joining:"15 Jan 2026", longStanding:false, status:"Active" as const },
  { id:"EMP-005", name:"Geeta Rajpoot", avatar:"GR", designation:"Sr. Developer", department:"Technology", email:"geeta@zeroform.in", role:"Developer", reportingTo:"Akash Rai", joining:"10 Apr 2023", longStanding:true, status:"Active" as const },
  { id:"EMP-006", name:"Bhagvendra Singh", avatar:"BS", designation:"Sr. Developer", department:"Technology", email:"bhagvendra@zeroform.in", role:"Developer", reportingTo:"Akash Rai", joining:"22 Jul 2023", longStanding:false, status:"Active" as const },
  { id:"EMP-007", name:"Pooja Singh", avatar:"PS", designation:"HR Manager", department:"HR", email:"pooja@zeroform.in", role:"HR Manager", reportingTo:"Mukteshwar Sharma", joining:"05 Feb 2022", longStanding:true, status:"Active" as const },
  { id:"EMP-008", name:"Rahul Verma", avatar:"RV", designation:"Accountant", department:"Finance", email:"rahul@zeroform.in", role:"Accountant", reportingTo:"Mukteshwar Sharma", joining:"12 Sep 2024", longStanding:false, status:"Inactive" as const },
  { id:"EMP-009", name:"Akash Agarwal", avatar:"AA", designation:"Admin Officer", department:"Finance", email:"akash.agarwal14@zeroform.in", role:"Admin", reportingTo:"—", joining:"14 Jan 2020", longStanding:true, status:"Active" as const },
  { id:"EMP-010", name:"Archana Verma", avatar:"AV", designation:"Operations Head", department:"Finance", email:"archana.verma@zeroform.in", role:"Viewer", reportingTo:"Akash Rai", joining:"15 Oct 2022", longStanding:true, status:"Active" as const },
  { id:"EMP-011", name:"Tanvi Soni", avatar:"TS", designation:"Data Analyst", department:"Marketing", email:"tanvi.soni28@zeroform.in", role:"Counselor", reportingTo:"Mukteshwar Sharma", joining:"03 Jul 2020", longStanding:true, status:"Active" as const },
  { id:"EMP-012", name:"Rekha Gupta", avatar:"RG", designation:"Content Writer", department:"Technology", email:"rekha.gupta@zeroform.in", role:"Viewer", reportingTo:"Mukteshwar Sharma", joining:"18 May 2025", longStanding:false, status:"Active" as const },
  { id:"EMP-013", name:"Ajay Pandey", avatar:"AP", designation:"Jr. Developer", department:"Management", email:"ajay.pandey@zeroform.in", role:"Accountant", reportingTo:"Mukteshwar Sharma", joining:"28 Apr 2020", longStanding:true, status:"Active" as const },
  { id:"EMP-014", name:"Rohit Soni", avatar:"RS", designation:"QA Engineer", department:"Marketing", email:"rohit.soni35@zeroform.in", role:"Admin", reportingTo:"—", joining:"21 Mar 2024", longStanding:false, status:"Active" as const },
  { id:"EMP-015", name:"Ritu Agarwal", avatar:"RA", designation:"Operations Head", department:"Finance", email:"ritu.agarwal@zeroform.in", role:"Super Admin", reportingTo:"Akash Rai", joining:"27 Jan 2022", longStanding:true, status:"Active" as const },
  { id:"EMP-016", name:"Sapna Krishnan", avatar:"SK", designation:"Project Manager", department:"Finance", email:"sapna.krishnan@zeroform.in", role:"Viewer", reportingTo:"Rahul Verma", joining:"05 May 2021", longStanding:true, status:"Active" as const },
  { id:"EMP-017", name:"Vinod Bose", avatar:"VB", designation:"Data Analyst", department:"Sales", email:"vinod.bose@zeroform.in", role:"Developer", reportingTo:"—", joining:"16 Feb 2020", longStanding:true, status:"Active" as const },
  { id:"EMP-018", name:"Neha Shah", avatar:"NS", designation:"UI/UX Designer", department:"Technology", email:"neha.shah@zeroform.in", role:"Manager", reportingTo:"—", joining:"09 Sep 2020", longStanding:true, status:"Active" as const },
  { id:"EMP-019", name:"Usha Pillai", avatar:"UP", designation:"Marketing Executive", department:"Marketing", email:"usha.pillai56@zeroform.in", role:"Developer", reportingTo:"Rahul Verma", joining:"01 Dec 2025", longStanding:false, status:"Active" as const },
  { id:"EMP-020", name:"Ravi Naidu", avatar:"RN", designation:"Trainee", department:"Operations", email:"ravi.naidu@zeroform.in", role:"HR Manager", reportingTo:"Akash Rai", joining:"12 Mar 2024", longStanding:false, status:"Inactive" as const },
  { id:"EMP-021", name:"Mukteshwar Das", avatar:"MD", designation:"Project Manager", department:"Design", email:"mukteshwar.das47@zeroform.in", role:"Accountant", reportingTo:"Akash Rai", joining:"02 Apr 2024", longStanding:false, status:"Inactive" as const },
  { id:"EMP-022", name:"Manju Mishra", avatar:"MM", designation:"Operations Head", department:"HR", email:"manju.mishra61@zeroform.in", role:"Developer", reportingTo:"Pooja Singh", joining:"17 Oct 2023", longStanding:false, status:"Inactive" as const },
  { id:"EMP-023", name:"Ayush Pandey", avatar:"AP", designation:"Business Analyst", department:"Sales", email:"ayush.pandey@zeroform.in", role:"Counselor", reportingTo:"Rahul Verma", joining:"17 Aug 2020", longStanding:true, status:"Active" as const },
  { id:"EMP-024", name:"Sanjana Bose", avatar:"SB", designation:"Operations Head", department:"Finance", email:"sanjana.bose@zeroform.in", role:"Super Admin", reportingTo:"Mukteshwar Sharma", joining:"23 Nov 2020", longStanding:true, status:"Active" as const },
  { id:"EMP-025", name:"Pankaj Mishra", avatar:"PM", designation:"Sales Manager", department:"Finance", email:"pankaj.mishra63@zeroform.in", role:"HR Manager", reportingTo:"—", joining:"05 Dec 2024", longStanding:false, status:"Active" as const },
  { id:"EMP-026", name:"Manju Mehta", avatar:"MM", designation:"Accountant", department:"Technology", email:"manju.mehta56@zeroform.in", role:"Counselor", reportingTo:"Rahul Verma", joining:"14 Aug 2025", longStanding:false, status:"Active" as const },
  { id:"EMP-027", name:"Shivam Tiwari", avatar:"ST", designation:"Sr. Developer", department:"Sales", email:"shivam.tiwari@zeroform.in", role:"Admin", reportingTo:"Akash Rai", joining:"07 Apr 2024", longStanding:false, status:"Active" as const },
  { id:"EMP-028", name:"Rakesh Nair", avatar:"RN", designation:"Admin Officer", department:"Technology", email:"rakesh.nair@zeroform.in", role:"Admin", reportingTo:"Mukteshwar Sharma", joining:"21 Sep 2020", longStanding:true, status:"Inactive" as const },
  { id:"EMP-029", name:"Anil Soni", avatar:"AS", designation:"Data Analyst", department:"Design", email:"anil.soni@zeroform.in", role:"Viewer", reportingTo:"Mukteshwar Sharma", joining:"06 Jul 2020", longStanding:true, status:"Inactive" as const },
  { id:"EMP-030", name:"Tanvi Nair", avatar:"TN", designation:"Business Analyst", department:"Sales", email:"tanvi.nair@zeroform.in", role:"Manager", reportingTo:"Akash Rai", joining:"07 May 2021", longStanding:true, status:"Inactive" as const },
  { id:"EMP-031", name:"Saurabh Singh", avatar:"SS", designation:"Project Manager", department:"Management", email:"saurabh.singh62@zeroform.in", role:"Developer", reportingTo:"Mukteshwar Sharma", joining:"17 Feb 2021", longStanding:true, status:"Active" as const },
  { id:"EMP-032", name:"Mamta Yadav", avatar:"MY", designation:"DevOps Engineer", department:"Technology", email:"mamta.yadav@zeroform.in", role:"HR Manager", reportingTo:"—", joining:"20 Jan 2024", longStanding:false, status:"Active" as const },
  { id:"EMP-033", name:"Ajay Murthy", avatar:"AM", designation:"Project Manager", department:"Operations", email:"ajay.murthy92@zeroform.in", role:"Counselor", reportingTo:"Akash Rai", joining:"09 Jul 2021", longStanding:true, status:"Active" as const },
  { id:"EMP-034", name:"Divya Mishra", avatar:"DM", designation:"CEO & Founder", department:"Design", email:"divya.mishra@zeroform.in", role:"Admin", reportingTo:"Mukteshwar Sharma", joining:"18 Apr 2024", longStanding:false, status:"Active" as const },
  { id:"EMP-035", name:"Rahul Yadav", avatar:"RY", designation:"QA Engineer", department:"Operations", email:"rahul.yadav70@zeroform.in", role:"Accountant", reportingTo:"—", joining:"26 Nov 2024", longStanding:false, status:"Active" as const },
  { id:"EMP-036", name:"Kapil Tiwari", avatar:"KT", designation:"Intern", department:"Operations", email:"kapil.tiwari14@zeroform.in", role:"Developer", reportingTo:"Pooja Singh", joining:"10 Oct 2021", longStanding:true, status:"Active" as const },
  { id:"EMP-037", name:"Deepika Kumar", avatar:"DK", designation:"Sales Manager", department:"Design", email:"deepika.kumar7@zeroform.in", role:"Admin", reportingTo:"Rahul Verma", joining:"27 May 2020", longStanding:true, status:"Active" as const },
  { id:"EMP-038", name:"Piyush Kumar", avatar:"PK", designation:"HR Manager", department:"Design", email:"piyush.kumar@zeroform.in", role:"Viewer", reportingTo:"—", joining:"01 Feb 2020", longStanding:true, status:"Inactive" as const },
  { id:"EMP-039", name:"Deepak Pillai", avatar:"DP", designation:"Sr. Developer", department:"Marketing", email:"deepak.pillai@zeroform.in", role:"Developer", reportingTo:"Rahul Verma", joining:"05 Jan 2022", longStanding:true, status:"Active" as const },
  { id:"EMP-040", name:"Harsh Bhatnagar", avatar:"HB", designation:"Accountant", department:"Finance", email:"harsh.bhatnagar@zeroform.in", role:"Counselor", reportingTo:"—", joining:"28 Jul 2024", longStanding:false, status:"Active" as const },
  { id:"EMP-041", name:"Ravi Mehta", avatar:"RM", designation:"CEO & Founder", department:"HR", email:"ravi.mehta@zeroform.in", role:"Counselor", reportingTo:"Rahul Verma", joining:"26 Nov 2025", longStanding:false, status:"Active" as const },
  { id:"EMP-042", name:"Tanvi Tiwari", avatar:"TT", designation:"DevOps Engineer", department:"Management", email:"tanvi.tiwari@zeroform.in", role:"HR Manager", reportingTo:"Akash Rai", joining:"27 Aug 2022", longStanding:true, status:"Active" as const },
  { id:"EMP-043", name:"Sanjay Shukla", avatar:"SS", designation:"CEO & Founder", department:"Finance", email:"sanjay.shukla@zeroform.in", role:"Accountant", reportingTo:"Mukteshwar Sharma", joining:"25 May 2022", longStanding:true, status:"Active" as const },
  { id:"EMP-044", name:"Saurabh Tripathi", avatar:"ST", designation:"CEO & Founder", department:"Technology", email:"saurabh.tripathi@zeroform.in", role:"Accountant", reportingTo:"Akash Rai", joining:"19 May 2020", longStanding:true, status:"Active" as const },
  { id:"EMP-045", name:"Mahesh Saxena", avatar:"MS", designation:"Data Analyst", department:"Technology", email:"mahesh.saxena@zeroform.in", role:"HR Manager", reportingTo:"Pooja Singh", joining:"02 Dec 2023", longStanding:false, status:"Active" as const },
  { id:"EMP-046", name:"Saurabh Pandey", avatar:"SP", designation:"QA Engineer", department:"Sales", email:"saurabh.pandey86@zeroform.in", role:"Counselor", reportingTo:"—", joining:"11 Nov 2020", longStanding:true, status:"Active" as const },
  { id:"EMP-047", name:"Meena Mehta", avatar:"MM", designation:"Project Manager", department:"Sales", email:"meena.mehta@zeroform.in", role:"Developer", reportingTo:"Akash Rai", joining:"14 Nov 2023", longStanding:false, status:"Active" as const },
  { id:"EMP-048", name:"Lalit Krishnan", avatar:"LK", designation:"Business Analyst", department:"Sales", email:"lalit.krishnan@zeroform.in", role:"Super Admin", reportingTo:"Pooja Singh", joining:"10 Apr 2023", longStanding:false, status:"Active" as const },
  { id:"EMP-049", name:"Naveen Nair", avatar:"NN", designation:"Content Writer", department:"Design", email:"naveen.nair@zeroform.in", role:"Manager", reportingTo:"Akash Rai", joining:"22 Feb 2022", longStanding:true, status:"Active" as const },
  { id:"EMP-050", name:"Pankaj Rai", avatar:"PR", designation:"Admin Officer", department:"Operations", email:"pankaj.rai26@zeroform.in", role:"Developer", reportingTo:"Mukteshwar Sharma", joining:"02 Apr 2023", longStanding:false, status:"Active" as const },
  { id:"EMP-051", name:"Mohit Mehta", avatar:"MM", designation:"Finance Manager", department:"Finance", email:"mohit.mehta@zeroform.in", role:"Viewer", reportingTo:"Rahul Verma", joining:"13 Apr 2021", longStanding:true, status:"Active" as const },
  { id:"EMP-052", name:"Swati Tiwari", avatar:"ST", designation:"Data Analyst", department:"Finance", email:"swati.tiwari90@zeroform.in", role:"Manager", reportingTo:"Mukteshwar Sharma", joining:"18 Apr 2020", longStanding:true, status:"Active" as const },
  { id:"EMP-053", name:"Kiran Murthy", avatar:"KM", designation:"Operations Head", department:"Marketing", email:"kiran.murthy@zeroform.in", role:"Manager", reportingTo:"—", joining:"27 Dec 2024", longStanding:false, status:"Active" as const },
  { id:"EMP-054", name:"Sachin Soni", avatar:"SS", designation:"Support Executive", department:"Design", email:"sachin.soni32@zeroform.in", role:"Accountant", reportingTo:"—", joining:"16 Nov 2021", longStanding:true, status:"Active" as const },
  { id:"EMP-055", name:"Meena Yadav", avatar:"MY", designation:"Marketing Executive", department:"Marketing", email:"meena.yadav@zeroform.in", role:"Admin", reportingTo:"Akash Rai", joining:"05 Apr 2023", longStanding:false, status:"Active" as const },
  { id:"EMP-056", name:"Rahul Mehta", avatar:"RM", designation:"Data Analyst", department:"Marketing", email:"rahul.mehta@zeroform.in", role:"Viewer", reportingTo:"Mukteshwar Sharma", joining:"07 Jul 2023", longStanding:false, status:"Inactive" as const },
  { id:"EMP-057", name:"Devendra Verma", avatar:"DV", designation:"Finance Manager", department:"Sales", email:"devendra.verma@zeroform.in", role:"Counselor", reportingTo:"Pooja Singh", joining:"25 Jul 2023", longStanding:false, status:"Active" as const },
  { id:"EMP-058", name:"Ramesh Shukla", avatar:"RS", designation:"Support Executive", department:"Finance", email:"ramesh.shukla63@zeroform.in", role:"Super Admin", reportingTo:"Rahul Verma", joining:"11 Nov 2025", longStanding:false, status:"Active" as const },
  { id:"EMP-059", name:"Mohit Joshi", avatar:"MJ", designation:"UI/UX Designer", department:"Management", email:"mohit.joshi@zeroform.in", role:"Super Admin", reportingTo:"Mukteshwar Sharma", joining:"21 Jul 2021", longStanding:true, status:"Active" as const },
  { id:"EMP-060", name:"Rekha Malhotra", avatar:"RM", designation:"Project Manager", department:"Finance", email:"rekha.malhotra@zeroform.in", role:"Counselor", reportingTo:"Rahul Verma", joining:"09 Jul 2022", longStanding:true, status:"Active" as const },
  { id:"EMP-061", name:"Yash Pillai", avatar:"YP", designation:"Sr. Developer", department:"Marketing", email:"yash.pillai9@zeroform.in", role:"Super Admin", reportingTo:"Mukteshwar Sharma", joining:"08 Apr 2020", longStanding:true, status:"Active" as const },
  { id:"EMP-062", name:"Manju Patel", avatar:"MP", designation:"Finance Manager", department:"Finance", email:"manju.patel@zeroform.in", role:"Accountant", reportingTo:"Pooja Singh", joining:"06 Oct 2024", longStanding:false, status:"Inactive" as const },
  { id:"EMP-063", name:"Pranav Soni", avatar:"PS", designation:"Business Analyst", department:"Technology", email:"pranav.soni@zeroform.in", role:"Accountant", reportingTo:"—", joining:"22 Jul 2023", longStanding:false, status:"Inactive" as const },
  { id:"EMP-064", name:"Varsha Yadav", avatar:"VY", designation:"Trainee", department:"Operations", email:"varsha.yadav@zeroform.in", role:"Admin", reportingTo:"—", joining:"26 Jan 2022", longStanding:true, status:"Active" as const },
  { id:"EMP-065", name:"Rahul Naidu", avatar:"RN", designation:"Project Manager", department:"Management", email:"rahul.naidu@zeroform.in", role:"Manager", reportingTo:"Mukteshwar Sharma", joining:"14 Jun 2025", longStanding:false, status:"Inactive" as const },
  { id:"EMP-066", name:"Deepak Shah", avatar:"DS", designation:"HR Manager", department:"Operations", email:"deepak.shah@zeroform.in", role:"Manager", reportingTo:"Rahul Verma", joining:"14 Dec 2024", longStanding:false, status:"Active" as const },
  { id:"EMP-067", name:"Vikram Agarwal", avatar:"VA", designation:"Content Writer", department:"Finance", email:"vikram.agarwal@zeroform.in", role:"Viewer", reportingTo:"Pooja Singh", joining:"01 Aug 2022", longStanding:true, status:"Active" as const },
  { id:"EMP-068", name:"Tanvi Kumar", avatar:"TK", designation:"Project Manager", department:"Operations", email:"tanvi.kumar@zeroform.in", role:"Accountant", reportingTo:"—", joining:"01 Sep 2021", longStanding:true, status:"Active" as const },
  { id:"EMP-069", name:"Nitin Rajan", avatar:"NR", designation:"Admin Officer", department:"Design", email:"nitin.rajan@zeroform.in", role:"Manager", reportingTo:"Rahul Verma", joining:"26 Jan 2020", longStanding:true, status:"Active" as const },
  { id:"EMP-070", name:"Anil Rajpoot", avatar:"AR", designation:"Finance Manager", department:"Marketing", email:"anil.rajpoot@zeroform.in", role:"Counselor", reportingTo:"Rahul Verma", joining:"24 Sep 2022", longStanding:true, status:"Active" as const },
  { id:"EMP-071", name:"Kapil Kumar", avatar:"KK", designation:"Admin Officer", department:"Technology", email:"kapil.kumar@zeroform.in", role:"Counselor", reportingTo:"Mukteshwar Sharma", joining:"24 Sep 2025", longStanding:false, status:"Active" as const },
  { id:"EMP-072", name:"Manju Agarwal", avatar:"MA", designation:"Finance Manager", department:"Operations", email:"manju.agarwal@zeroform.in", role:"HR Manager", reportingTo:"Pooja Singh", joining:"08 Jun 2021", longStanding:true, status:"Active" as const },
  { id:"EMP-073", name:"Suresh Agarwal", avatar:"SA", designation:"Sr. Developer", department:"Management", email:"suresh.agarwal@zeroform.in", role:"Developer", reportingTo:"Rahul Verma", joining:"04 Jan 2024", longStanding:false, status:"Active" as const },
  { id:"EMP-074", name:"Pankaj Dubey", avatar:"PD", designation:"Sr. Developer", department:"Operations", email:"pankaj.dubey@zeroform.in", role:"Manager", reportingTo:"Mukteshwar Sharma", joining:"27 Feb 2023", longStanding:false, status:"Active" as const },
  { id:"EMP-075", name:"Alok Singh", avatar:"AS", designation:"Intern", department:"HR", email:"alok.singh@zeroform.in", role:"Accountant", reportingTo:"Mukteshwar Sharma", joining:"08 Feb 2024", longStanding:false, status:"Active" as const },
  { id:"EMP-076", name:"Lalit Shukla", avatar:"LS", designation:"Sales Manager", department:"Sales", email:"lalit.shukla@zeroform.in", role:"Manager", reportingTo:"Pooja Singh", joining:"28 Oct 2023", longStanding:false, status:"Active" as const },
  { id:"EMP-077", name:"Lalit Tiwari", avatar:"LT", designation:"Accountant", department:"Finance", email:"lalit.tiwari11@zeroform.in", role:"Developer", reportingTo:"Akash Rai", joining:"06 Sep 2020", longStanding:true, status:"Active" as const },
  { id:"EMP-078", name:"Devendra Das", avatar:"DD", designation:"Support Executive", department:"Operations", email:"devendra.das37@zeroform.in", role:"Accountant", reportingTo:"Rahul Verma", joining:"03 Nov 2021", longStanding:true, status:"Inactive" as const },
  { id:"EMP-079", name:"Piyush Bose", avatar:"PB", designation:"Accountant", department:"Sales", email:"piyush.bose29@zeroform.in", role:"Developer", reportingTo:"Pooja Singh", joining:"27 Mar 2020", longStanding:true, status:"Active" as const },
  { id:"EMP-080", name:"Ramesh Krishnan", avatar:"RK", designation:"Business Analyst", department:"Design", email:"ramesh.krishnan89@zeroform.in", role:"Accountant", reportingTo:"Rahul Verma", joining:"09 Sep 2024", longStanding:false, status:"Active" as const },
  { id:"EMP-081", name:"Geeta Shah", avatar:"GS", designation:"Project Manager", department:"Operations", email:"geeta.shah30@zeroform.in", role:"Super Admin", reportingTo:"Pooja Singh", joining:"19 Jan 2021", longStanding:true, status:"Active" as const },
  { id:"EMP-082", name:"Rakesh Dubey", avatar:"RD", designation:"Finance Manager", department:"Sales", email:"rakesh.dubey@zeroform.in", role:"Manager", reportingTo:"Mukteshwar Sharma", joining:"16 Jun 2023", longStanding:false, status:"Active" as const },
  { id:"EMP-083", name:"Manish Tripathi", avatar:"MT", designation:"Data Analyst", department:"Design", email:"manish.tripathi52@zeroform.in", role:"Super Admin", reportingTo:"Rahul Verma", joining:"03 Jun 2022", longStanding:true, status:"Active" as const },
  { id:"EMP-084", name:"Sumit Naidu", avatar:"SN", designation:"CEO & Founder", department:"Design", email:"sumit.naidu@zeroform.in", role:"HR Manager", reportingTo:"—", joining:"12 Oct 2023", longStanding:false, status:"Active" as const },
  { id:"EMP-085", name:"Pradeep Agarwal", avatar:"PA", designation:"Operations Head", department:"HR", email:"pradeep.agarwal@zeroform.in", role:"Manager", reportingTo:"Rahul Verma", joining:"04 Jan 2025", longStanding:false, status:"Active" as const },
  { id:"EMP-086", name:"Neha Rajpoot", avatar:"NR", designation:"Operations Head", department:"Management", email:"neha.rajpoot@zeroform.in", role:"Admin", reportingTo:"Akash Rai", joining:"27 Feb 2023", longStanding:false, status:"Inactive" as const },
  { id:"EMP-087", name:"Deepak Reddy", avatar:"DR", designation:"Business Analyst", department:"Operations", email:"deepak.reddy@zeroform.in", role:"Manager", reportingTo:"Rahul Verma", joining:"08 Aug 2024", longStanding:false, status:"Active" as const },
  { id:"EMP-088", name:"Archana Naidu", avatar:"AN", designation:"Intern", department:"Technology", email:"archana.naidu54@zeroform.in", role:"Counselor", reportingTo:"—", joining:"09 Jan 2022", longStanding:true, status:"Active" as const },
  { id:"EMP-089", name:"Vijay Reddy", avatar:"VR", designation:"Intern", department:"Design", email:"vijay.reddy@zeroform.in", role:"Counselor", reportingTo:"Pooja Singh", joining:"18 Sep 2023", longStanding:false, status:"Active" as const },
  { id:"EMP-090", name:"Kavita Yadav", avatar:"KY", designation:"Finance Manager", department:"Sales", email:"kavita.yadav53@zeroform.in", role:"Super Admin", reportingTo:"Pooja Singh", joining:"24 Aug 2025", longStanding:false, status:"Inactive" as const },
  { id:"EMP-091", name:"Kiran Rajput", avatar:"KR", designation:"Support Executive", department:"Management", email:"kiran.rajput76@zeroform.in", role:"Counselor", reportingTo:"Mukteshwar Sharma", joining:"28 Aug 2020", longStanding:true, status:"Active" as const },
  { id:"EMP-092", name:"Mahesh Rajput", avatar:"MR", designation:"Data Analyst", department:"HR", email:"mahesh.rajput34@zeroform.in", role:"Counselor", reportingTo:"—", joining:"23 Jul 2025", longStanding:false, status:"Active" as const },
  { id:"EMP-093", name:"Radhika Pillai", avatar:"RP", designation:"DevOps Engineer", department:"Marketing", email:"radhika.pillai@zeroform.in", role:"Manager", reportingTo:"—", joining:"02 Oct 2020", longStanding:true, status:"Active" as const },
  { id:"EMP-094", name:"Manoj Shukla", avatar:"MS", designation:"Jr. Developer", department:"Sales", email:"manoj.shukla@zeroform.in", role:"Admin", reportingTo:"Rahul Verma", joining:"06 Dec 2022", longStanding:true, status:"Inactive" as const },
  { id:"EMP-095", name:"Tanvi Singh", avatar:"TS", designation:"Business Analyst", department:"Marketing", email:"tanvi.singh@zeroform.in", role:"Developer", reportingTo:"Akash Rai", joining:"17 Jul 2024", longStanding:false, status:"Active" as const },
  { id:"EMP-096", name:"Neha Rai", avatar:"NR", designation:"UI/UX Designer", department:"Sales", email:"neha.rai@zeroform.in", role:"HR Manager", reportingTo:"Rahul Verma", joining:"19 Mar 2021", longStanding:true, status:"Active" as const },
  { id:"EMP-097", name:"Rekha Sharma", avatar:"RS", designation:"Content Writer", department:"Operations", email:"rekha.sharma@zeroform.in", role:"Developer", reportingTo:"Mukteshwar Sharma", joining:"15 Jun 2024", longStanding:false, status:"Active" as const },
  { id:"EMP-098", name:"Devendra Kumar", avatar:"DK", designation:"Content Writer", department:"Operations", email:"devendra.kumar50@zeroform.in", role:"Manager", reportingTo:"Mukteshwar Sharma", joining:"08 Jul 2024", longStanding:false, status:"Active" as const },
  { id:"EMP-099", name:"Nidhi Goldar", avatar:"NG", designation:"CEO & Founder", department:"Sales", email:"nidhi.goldar73@zeroform.in", role:"Super Admin", reportingTo:"—", joining:"24 Aug 2022", longStanding:true, status:"Active" as const },
  { id:"EMP-100", name:"Tanvi Bhatnagar", avatar:"TB", designation:"Admin Officer", department:"Finance", email:"tanvi.bhatnagar@zeroform.in", role:"Developer", reportingTo:"Mukteshwar Sharma", joining:"21 Nov 2020", longStanding:true, status:"Active" as const },
  { id:"EMP-101", name:"Vijay Chaturvedi", avatar:"VC", designation:"Intern", department:"Technology", email:"vijay.chaturvedi@zeroform.in", role:"Counselor", reportingTo:"Rahul Verma", joining:"06 Apr 2021", longStanding:true, status:"Active" as const },
  { id:"EMP-102", name:"Rohit Murthy", avatar:"RM", designation:"Sales Manager", department:"Operations", email:"rohit.murthy@zeroform.in", role:"Accountant", reportingTo:"Rahul Verma", joining:"26 May 2025", longStanding:false, status:"Active" as const },
  { id:"EMP-103", name:"Mohit Mishra", avatar:"MM", designation:"Intern", department:"Finance", email:"mohit.mishra@zeroform.in", role:"Viewer", reportingTo:"—", joining:"12 Feb 2023", longStanding:false, status:"Active" as const },
  { id:"EMP-104", name:"Mohit Chaturvedi", avatar:"MC", designation:"Marketing Executive", department:"Sales", email:"mohit.chaturvedi@zeroform.in", role:"Counselor", reportingTo:"Mukteshwar Sharma", joining:"22 Apr 2023", longStanding:false, status:"Active" as const },
  { id:"EMP-105", name:"Hemant Saxena", avatar:"HS", designation:"UI/UX Designer", department:"Finance", email:"hemant.saxena@zeroform.in", role:"Manager", reportingTo:"Pooja Singh", joining:"21 Jul 2020", longStanding:true, status:"Active" as const },
  { id:"EMP-106", name:"Kapil Reddy", avatar:"KR", designation:"Trainee", department:"Technology", email:"kapil.reddy69@zeroform.in", role:"Developer", reportingTo:"Rahul Verma", joining:"15 Jun 2025", longStanding:false, status:"Inactive" as const },
  { id:"EMP-107", name:"Saurabh Mehta", avatar:"SM", designation:"Finance Manager", department:"HR", email:"saurabh.mehta@zeroform.in", role:"Admin", reportingTo:"Rahul Verma", joining:"20 Jul 2022", longStanding:true, status:"Active" as const },
];

const ROLES = ["All Roles","Super Admin","Admin","Developer","HR Manager","Accountant","Counselor","Manager","Viewer"];
const DESGS = ["All Designations","CEO & Founder","Sr. Developer","Jr. Developer","Trainee","Intern","HR Manager","Accountant","Project Manager","QA Engineer","DevOps Engineer","Data Analyst","Admin Officer","Marketing Executive","Business Analyst","Content Writer","Support Executive","Sales Manager","Operations Head","Finance Manager","UI/UX Designer"];
const DEPTS = ["All Departments","Management","Technology","HR","Finance","Operations","Marketing","Sales","Design"];
const AVATAR_COLORS = ["#4f46e5","#7c3aed","#0284c7","#16a34a","#dc2626","#db2777","#ea580c","#ca8a04","#0891b2","#059669"];

export default function EmployeesPage() {
  const [search,  setSearch]  = useState("");
  const [role,    setRole]    = useState("All Roles");
  const [desg,    setDesg]    = useState("All Designations");
  const [dept,    setDept]    = useState("All Departments");
  const [page,    setPage]    = useState(1);
  const [selected,setSelected]= useState<Set<string>>(new Set());
  const [openMenu,setOpenMenu]= useState<string|null>(null);

  const filtered = EMPLOYEES.filter(e => {
    const q = search.toLowerCase();
    const matchQ = !q || e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || e.id.toLowerCase().includes(q) || e.designation.toLowerCase().includes(q);
    const matchR = role === "All Roles" || e.role === role;
    const matchD = desg === "All Designations" || e.designation === desg;
    const matchDept = dept === "All Departments" || e.department === dept;
    return matchQ && matchR && matchD && matchDept;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const paged      = filtered.slice((safePage-1)*PAGE_SIZE, safePage*PAGE_SIZE);
  const allSelected= paged.length > 0 && paged.every(e => selected.has(e.id));
  const toggleAll  = () => setSelected(prev => { const n=new Set(prev); if(allSelected) paged.forEach(e=>n.delete(e.id)); else paged.forEach(e=>n.add(e.id)); return n; });

  const clearFilters = () => { setSearch(""); setRole("All Roles"); setDesg("All Designations"); setDept("All Departments"); setPage(1); };
  const hasFilter = search || role!=="All Roles" || desg!=="All Designations" || dept!=="All Departments";

  const pageNums = () => {
    const nums:number[] = [];
    for(let i=Math.max(1,safePage-2); i<=Math.min(totalPages,safePage+2); i++) nums.push(i);
    return nums;
  };

  return (
    <div style={{ padding: "1.5rem 0" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.25rem" }}>
        <div>
          <h4 style={{ fontSize:20, fontWeight:800, color:"#1e1b4b", margin:0 }}>Employees</h4>
          <div style={{ fontSize:12, color:"#9ca3af", marginTop:2 }}>
            <span>Home</span><i className="ri-arrow-right-s-line" style={{ margin:"0 4px" }}/><span>HR</span><i className="ri-arrow-right-s-line" style={{ margin:"0 4px" }}/><span style={{ color:"#4f46e5" }}>Employees</span>
          </div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button style={{...OB}}><i className="ri-user-shared-line" /> Invite Employee</button>
          <button style={{...OB}}><i className="ri-upload-2-line" /> Import</button>
          <button style={{...OB}}><i className="ri-download-2-line" /> Export</button>
          <Link href="/hr/employees/new" style={{...PB}}><i className="ri-add-line" /> Add Employee</Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="row g-3" style={{ marginBottom:"1.25rem" }}>
        {[
          { label:"Total Employees", value:EMPLOYEES.length,                                icon:"ri-group-line",           color:"#4f46e5", bg:"#ede9fe" },
          { label:"Active",          value:EMPLOYEES.filter(e=>e.status==="Active").length,  icon:"ri-checkbox-circle-line", color:"#16a34a", bg:"#dcfce7" },
          { label:"Inactive",        value:EMPLOYEES.filter(e=>e.status==="Inactive").length,icon:"ri-close-circle-line",    color:"#dc2626", bg:"#fee2e2" },
          { label:"Long Standing",   value:EMPLOYEES.filter(e=>e.longStanding).length,       icon:"ri-medal-line",           color:"#ca8a04", bg:"#fef9c3" },
        ].map(c=>(
          <div key={c.label} className="col">
            <div style={{ background:"#fff", borderRadius:12, border:"1px solid #ede9fe", padding:"14px 16px", display:"flex", alignItems:"center", gap:12, boxShadow:"0 2px 8px rgba(79,70,229,0.06)" }}>
              <div style={{ width:42, height:42, borderRadius:10, background:c.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <i className={c.icon} style={{ fontSize:20, color:c.color }}/>
              </div>
              <div>
                <div style={{ fontSize:22, fontWeight:800, color:c.color, lineHeight:1 }}>{c.value}</div>
                <div style={{ fontSize:11, color:"#9ca3af", fontWeight:600, marginTop:2 }}>{c.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background:"#fff", borderRadius:14, border:"1px solid #ede9fe", boxShadow:"0 2px 12px rgba(79,70,229,0.06)", overflow:"hidden" }}>
        {/* Filters */}
        <div style={{ padding:"14px 16px", borderBottom:"1px solid #f3f4f6", display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" as const }}>
          <div style={{ position:"relative", flex:1, minWidth:200 }}>
            <i className="ri-search-line" style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"#9ca3af", fontSize:14 }}/>
            <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search name, email, ID, designation..."
              style={{ width:"100%", padding:"7px 10px 7px 32px", borderRadius:8, border:"1.5px solid #e5e7eb", fontSize:12, outline:"none", background:"#fafafa" }}/>
          </div>
          <select value={dept} onChange={e=>{setDept(e.target.value);setPage(1);}} style={{...SS}}>
            {DEPTS.map(d=><option key={d}>{d}</option>)}
          </select>
          <select value={desg} onChange={e=>{setDesg(e.target.value);setPage(1);}} style={{...SS}}>
            {DESGS.map(d=><option key={d}>{d}</option>)}
          </select>
          <select value={role} onChange={e=>{setRole(e.target.value);setPage(1);}} style={{...SS}}>
            {ROLES.map(r=><option key={r}>{r}</option>)}
          </select>
          {hasFilter && <button onClick={clearFilters} style={{ fontSize:12, color:"#dc2626", background:"none", border:"none", cursor:"pointer", fontWeight:600 }}><i className="ri-close-line"/> Clear</button>}
          <span style={{ marginLeft:"auto", fontSize:12, color:"#9ca3af", whiteSpace:"nowrap" }}>{filtered.length} of {EMPLOYEES.length} employees</span>
        </div>

        {/* Table */}
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead>
              <tr style={{ background:"#f9f9fb" }}>
                <th style={{...TH}}><input type="checkbox" checked={allSelected} onChange={toggleAll} style={{ accentColor:"#7c3aed" }}/></th>
                <th style={{...TH, textAlign:"left"}}>Employee</th>
                <th style={{...TH, textAlign:"left"}}>Email</th>
                <th style={{...TH, textAlign:"left"}}>User Role</th>
                <th style={{...TH, textAlign:"left"}}>Reporting To</th>
                <th style={{...TH, textAlign:"center"}}>Status</th>
                <th style={{...TH, textAlign:"center"}}>Joining Date</th>
                <th style={{...TH, textAlign:"center"}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((emp, idx) => {
                const globalIdx = EMPLOYEES.findIndex(e=>e.id===emp.id);
                const avatarColor = AVATAR_COLORS[globalIdx % AVATAR_COLORS.length];
                return (
                  <tr key={emp.id} style={{ borderTop:"1px solid #f3f4f6", background:selected.has(emp.id)?"#faf5ff":"transparent" }}>
                    <td style={{...TD, textAlign:"center", width:40}}>
                      <input type="checkbox" checked={selected.has(emp.id)} onChange={()=>setSelected(prev=>{const n=new Set(prev);n.has(emp.id)?n.delete(emp.id):n.add(emp.id);return n;})} style={{ accentColor:"#7c3aed" }}/>
                    </td>
                    <td style={{...TD}}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{ width:36, height:36, borderRadius:"50%", background:avatarColor, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:11, flexShrink:0 }}>{emp.avatar}</div>
                        <div>
                          <div style={{ display:"flex", alignItems:"center", gap:5, flexWrap:"wrap" as const }}>
                            <span style={{ fontWeight:700, color:"#1e1b4b", fontSize:13 }}>{emp.name}</span>
                            {emp.longStanding && <span style={{ fontSize:10, fontWeight:700, color:"#ca8a04", background:"#fef9c3", borderRadius:20, padding:"1px 7px" }}>Long Standing</span>}
                          </div>
                          <div style={{ fontSize:11, color:"#9ca3af" }}>{emp.designation} · {emp.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{...TD}}><span style={{ color:"#374151", fontSize:12 }}>{emp.email}</span></td>
                    <td style={{...TD}}>
                      <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:11, fontWeight:600, color:"#4f46e5", background:"#ede9fe", borderRadius:6, padding:"2px 8px" }}>
                        <i className="ri-shield-user-line" style={{ fontSize:11 }}/>{emp.role}
                      </span>
                    </td>
                    <td style={{...TD}}><span style={{ color:"#6b7280", fontSize:12 }}>{emp.reportingTo}</span></td>
                    <td style={{...TD, textAlign:"center"}}>
                      <span style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:11, fontWeight:600, color:emp.status==="Active"?"#16a34a":"#dc2626", background:emp.status==="Active"?"#dcfce7":"#fee2e2", borderRadius:20, padding:"2px 10px" }}>
                        <span style={{ width:6, height:6, borderRadius:"50%", background:emp.status==="Active"?"#16a34a":"#dc2626", display:"inline-block" }}/>{emp.status}
                      </span>
                    </td>
                    <td style={{...TD, textAlign:"center", color:"#6b7280", fontSize:12}}>{emp.joining}</td>
                    <td style={{...TD, textAlign:"center"}}>
                      <div style={{ position:"relative", display:"inline-block" }}>
                        <button onClick={()=>setOpenMenu(openMenu===emp.id?null:emp.id)}
                          style={{ background:"none", border:"none", cursor:"pointer", padding:"4px 8px", borderRadius:6, color:"#6b7280", fontSize:18 }}>
                          <i className="ri-more-2-line"/>
                        </button>
                        {openMenu===emp.id&&(
                          <div style={{ position:"absolute", right:0, top:"100%", zIndex:100, background:"#fff", border:"1px solid #ede9fe", borderRadius:10, boxShadow:"0 8px 24px rgba(79,70,229,0.12)", minWidth:160, padding:"4px 0" }}>
                            {[
                              {icon:"ri-eye-line",           label:"View Profile"},
                              {icon:"ri-edit-line",          label:"Edit Details"},
                              {icon:"ri-calendar-check-line",label:"Attendance"},
                              {icon:"ri-delete-bin-6-line",  label:"Remove", danger:true},
                            ].map(a=>(
                              <button key={a.label} onClick={()=>setOpenMenu(null)}
                                style={{ display:"flex", alignItems:"center", gap:8, width:"100%", padding:"8px 14px", background:"none", border:"none", cursor:"pointer", fontSize:13, color:(a as {danger?:boolean}).danger?"#dc2626":"#374151", fontWeight:500, textAlign:"left" as const }}>
                                <i className={a.icon}/>{a.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paged.length===0&&(
                <tr><td colSpan={8} style={{ textAlign:"center", padding:"3rem", color:"#9ca3af" }}>
                  <i className="ri-search-line" style={{ fontSize:32, display:"block", marginBottom:8 }}/> No employees found
                </td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div style={{ padding:"12px 16px", borderTop:"1px solid #f3f4f6", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontSize:12, color:"#9ca3af" }}>
            Showing {(safePage-1)*PAGE_SIZE+1} to {Math.min(safePage*PAGE_SIZE,filtered.length)} of {filtered.length} entries
          </span>
          <div style={{ display:"flex", gap:4, alignItems:"center" }}>
            <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={safePage===1}
              style={{ padding:"4px 10px", borderRadius:6, border:"1px solid #e5e7eb", background:"#fff", color:safePage===1?"#d1d5db":"#6b7280", fontSize:12, fontWeight:600, cursor:safePage===1?"not-allowed":"pointer" }}>
              <i className="ri-arrow-left-s-line"/> Prev
            </button>
            {pageNums().map(n=>(
              <button key={n} onClick={()=>setPage(n)}
                style={{ padding:"4px 10px", borderRadius:6, border:"1px solid #e5e7eb", background:n===safePage?"#4f46e5":"#fff", color:n===safePage?"#fff":"#6b7280", fontSize:12, fontWeight:600, cursor:"pointer" }}>
                {n}
              </button>
            ))}
            <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={safePage===totalPages}
              style={{ padding:"4px 10px", borderRadius:6, border:"1px solid #e5e7eb", background:"#fff", color:safePage===totalPages?"#d1d5db":"#6b7280", fontSize:12, fontWeight:600, cursor:safePage===totalPages?"not-allowed":"pointer" }}>
              Next <i className="ri-arrow-right-s-line"/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const TH: React.CSSProperties = { padding:"10px 14px", fontWeight:700, fontSize:11, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.04em", whiteSpace:"nowrap", borderBottom:"2px solid #ede9fe" };
const TD: React.CSSProperties = { padding:"10px 14px", verticalAlign:"middle", whiteSpace:"nowrap" };
const SS: React.CSSProperties = { padding:"7px 10px", borderRadius:8, border:"1.5px solid #e5e7eb", fontSize:12, color:"#374151", background:"#fafafa", cursor:"pointer", outline:"none" };
const OB: React.CSSProperties = { display:"inline-flex", alignItems:"center", gap:6, padding:"7px 14px", borderRadius:8, border:"1.5px solid #ede9fe", background:"#fff", color:"#374151", fontSize:13, fontWeight:600, cursor:"pointer", textDecoration:"none" };
const PB: React.CSSProperties = { display:"inline-flex", alignItems:"center", gap:6, padding:"7px 16px", borderRadius:8, border:"none", background:"linear-gradient(135deg,#4f46e5,#7c3aed)", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", textDecoration:"none" };
