/**
 * @fileOverview 画面多言語スイッチ管理クラス
 *
 * @author Panasonic Corporation
 */
/**
 * 画面多言語スイッチ管理クラスのインスタンス
 */

//ie
if (navigator.browserLanguage != "undefined" && navigator.browserLanguage != null) {
    if (navigator.systemLanguage == "zh-CN") {
        document.write('<script src="/js/language/en_US.js"></script>');
    } else {
        document.write('<script src="/js/language/en_US.js"></script>');
    }
}
//firefox,chrome,360
else {
    if (navigator.language == "zh-CN") {
        document.write("<script src='/js/language/en_US.js'></script>");
    } else {
        document.write("<script src='/js/language/en_US.js'></script>");
    }
}

function cmsg_show(ID) {
    eval("var sExpression = gStatus."+ ID);
    return sExpression;
}

var setupInfoOssLicense =
    "                                Open Source Software Information\n" +
    "                                ======================================================================\n" +
    "                                   NOTE! This copyright does *not* cover user programs that use kernel\n" +
    "                                 services by normal system calls - this is merely considered normal use\n" +
    "                                 of the kernel, and does *not* fall under the heading of \"derived work\".\n" +
    "                                 Also note that the GPL below is copyrighted by the Free Software\n" +
    "                                 Foundation, but the instance of code that it refers to (the Linux\n" +
    "                                 kernel) is copyrighted by me and others who actually wrote it.\n" +
    "\n" +
    "                                 Also note that the only valid version of the GPL as far as the kernel\n" +
    "                                 is concerned is _this_ particular version of the license (ie v2, not\n" +
    "                                 v2.2 or v3.x or whatever), unless explicitly otherwise stated.\n" +
    "\n" +
    "                                            Linus Torvalds\n" +
    "\n" +
    "                                ======================================================================\n" +
    "\n" +
    "                                The Academic Free License\n" +
    "                                 v. 2.0\n" +
    "\n" +
    "                                This Academic Free License (the \"License\") applies to any original work\n" +
    "                                of authorship (the \"Original Work\") whose owner (the \"Licensor\") has placed\n" +
    "                                the following notice immediately following the copyright notice\n" +
    "                                for the Original Work:\n" +
    "                                Licensed under the Academic Free License version 2.0\n" +
    "\n" +
    "                                1) Grant of Copyright License. Licensor hereby grants You a world-wide,\n" +
    "                                royalty-free, non-exclusive, perpetual, sublicenseable license to do the following:\n" + 
    "                                a) to reproduce the Original Work in copies;\n" + 
    "\n" +
    "                                b) to prepare derivative works (\"Derivative Works\") based upon the Original Work; \n" +
    "\n" +
    "                                c) to distribute copies of the Original Work and Derivative Works to the public;\n" + 
    "\n" +
    "                                d) to perform the Original Work publicly; and \n" +
    "\n" +
    "                                e) to display the Original Work publicly.\n" +
    "\n" +
    "                                2) Grant of Patent License. Licensor hereby grants You a world-wide, \n" +
    "                                royalty-free, non-exclusive, perpetual, sublicenseable license, \n" +
    "                                under patent claims owned or controlled by the Licensor that are embodied \n" +
    "                                in the Original Work as furnished by the Licensor, to make, use, sell and\n" +
    "                                offer for sale the Original Work and Derivative Works.\n" +
    "\n" +
    "                                3) Grant of Source Code License. The term \"Source Code\" means the preferred\n" +
    "                                form of the Original Work for making modifications to it and all available\n" +
    "                                documentation describing how to modify the Original Work.\n" +
    "                                Licensor hereby agrees to provide a machine-readable copy of the Source Code\n" +
    "                                of the Original Work along with each copy of the Original Work that Licensor distributes.\n" +
    "                                Licensor reserves the right to satisfy this obligation by placing a machine-readable copy\n" +
    "                                of the Source Code in an information repository reasonably calculated\n" +
    "                                to permit inexpensive and convenient access by You for as long as Licensor\n" +
    "                                continues to distribute the Original Work, and by publishing the address of\n" +
    "                                that information repository in a notice immediately following the copyright\n" +
    "                                notice that applies to the Original Work.\n" +
    "\n" +
    "                                4) Exclusions From License Grant. Neither the names of Licensor, \n" +
    "                                nor the names of any contributors to the Original Work, \n" +
    "                                nor any of their trademarks or service marks, may be used to endorse or promote\n" +
    "                                products derived from this Original Work without express prior written permission of the Licensor.\n" +
    "                                Nothing in this License shall be deemed to grant any rights to trademarks, copyrights,\n" +
    "                                patents, trade secrets or any other intellectual property of Licensor\n" +
    "                                except as expressly stated herein.\n" +
    "                                No patent license is granted to make, use, sell or offer to sell embodiments\n" +
    "                                of any patent claims other than the licensed claims defined in Section 2.\n" +
    "                                No right is granted to the trademarks of Licensor even if such marks are included in\n" +
    "                                the Original Work.\n" +
    "                                Nothing in this License shall be interpreted to prohibit Licensor from licensing under different\n" +
    "                                terms from this License any Original Work that Licensor\n" +
    "                                otherwise would have a right to license.\n" +
    "\n" +
    "                                5) This section intentionally omitted.\n" +
    "\n" +
    "                                6) Attribution Rights. You must retain, in the Source Code of any Derivative Works\n" +
    "                                that You create, all copyright, patent or trademark notices from the Source Code of\n" +
    "                                the Original Work, as well as any notices of licensing and any descriptive text\n" +
    "                                identified therein as an \"Attribution Notice.\"\n" +
    "                                You must cause the Source Code for any Derivative Works that You create to carry\n" +
    "                                a prominent Attribution Notice reasonably calculated to inform recipients \n" +
    "                                that You have modified the Original Work.\n" +
    "\n" +
    "                                7) Warranty of Provenance and Disclaimer of Warranty.\n" +
    "                                Licensor warrants that the copyright in and to the Original Work and the patent rights\n" +
    "                                granted herein by Licensor are owned by the Licensor or are sublicensed to You\n" +
    "                                under the terms of this License with the permission of the contributor(s) of those copyrights\n" +
    "                                and patent rights.  Except as expressly stated in the immediately proceeding sentence,\n" +
    "                                the Original Work is provided under this License on an \"AS IS\" BASIS and WITHOUT WARRANTY,\n" +
    "                                either express or implied, including, without limitation, the warranties of\n" +
    "                                NON-INFRINGEMENT, MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.\n" +
    "                                THE ENTIRE RISK AS TO THE QUALITY OF THE ORIGINAL WORK IS WITH YOU.\n" +
    "                                This DISCLAIMER OF WARRANTY constitutes an essential part of this License.\n" +
    "                                No license to Original Work is granted hereunder except under this disclaimer.\n" +  
    "\n" +
    "                                8) Limitation of Liability. Under no circumstances and under no legal theory, \n" +
    "                                whether in tort (including negligence), contract, or otherwise, shall the Licensor\n" +
    "                                be liable to any person for any direct, indirect, special, incidental, or consequential\n" +
    "                                damages of any character arising as a result of this License or the use of the Original Work\n" +
    "                                including, without limitation, damages for loss of goodwill, work stoppage,\n" +
    "                                computer failure or malfunction, or any and all other commercial damages or losses.\n" +
    "                                This limitation of liability shall not apply to liability for death or personal\n" +
    "                                injury resulting from Licensor`s negligence to the extent applicable law\n" +
    "                                prohibits such limitation.  Some jurisdictions do not allow the exclusion or limitation of\n" +
    "                                incidental or consequential damages, so this exclusion and limitation may not apply to You.\n" +
    "\n" +
    "                                9) Acceptance and Termination. If You distribute  copies of the Original Work or a Derivative Work,\n" +
    "                                You must make a reasonable effort under the circumstances to obtain the express assent\n" +
    "                                of recipients to the terms of this License.  \n" +
    "                                Nothing else but this License (or another written agreement between Licensor and You)\n" +
    "                                grants You permission to create Derivative Works based upon the Original Work or to exercise\n" +
    "                                any of the rights granted in Section 1 herein, and any attempt to do so except under the terms\n" +
    "                                of this License (or another written agreement between Licensor and You) is expressly\n" +
    "                                prohibited by U.S. copyright law, the equivalent laws of other countries,\n" +
    "                                and by international treaty.\n" +
    "                                Therefore, by exercising any of the rights granted to You in Section 1 herein, \n" +
    "                                You indicate Your acceptance of this License and all of its terms and conditions.\n" +
   "\n" +
   "                                 10) Termination for Patent Action. This License shall terminate automatically and\n" +
   "                                 You may no longer exercise any of the rights granted to You by this License as of the date\n" +
   "                                 You commence an action, including a cross-claim or counterclaim,\n" +
   "                                 for patent infringement (i) against Licensor with respect to a patent applicable to\n" +
   "                                 software or (ii) against any entity with respect to a patent applicable to the Original Work\n" +
   "                                 (but excluding combinations of the Original Work with other software or hardware).\n" +
   "\n" +
   "                                 11) Jurisdiction, Venue and Governing Law. Any action or suit relating to\n" +
   "                                 this License may be brought only in the courts of a jurisdiction\n" +
   "                                 wherein the Licensor resides or in which Licensor conducts its primary business, \n" +
   "                                 and under the laws of that jurisdiction excluding its conflict-of-law provisions. \n" +
   "                                 The application of the United Nations Convention on Contracts for the International\n" +
   "                                 Sale of Goods is expressly excluded.  \n" +
   "                                 Any use of the Original Work outside the scope of this License or after its termination\n" +
   "                                 shall be subject to the requirements and penalties of the U.S. Copyright Act,\n" +
   "                                 17 U.S.C. ¤ 101 et seq., the equivalent laws of other countries, and international treaty.\n" +
   "                                 This section shall survive the termination of this License.\n" + 
   "\n" +
   "                                 12) Attorneys Fees. In any action to enforce the terms of this License or seeking damages\n" +
   "                                 relating thereto, the prevailing party shall be entitled to recover its costs and expenses,\n" +
   "                                 including, without limitation, reasonable attorneys` fees and costs incurred in connection with\n" +
   "                                 such action, including any appeal of such action.  This section shall survive the termination\n" +
   "                                 of this License.\n" +
   "\n" +
   "                                 13) Miscellaneous. This License represents the complete agreement concerning the subject\n" +
   "                                 matter hereof.  If any provision of this License is held to be unenforceable, \n" +
   "                                 such provision shall be reformed only to the extent necessary to make it enforceable.\n" +
   "\n" +
   "                                 14) Definition of \"You\" in This License. \"You\" throughout this License, whether \n" +
   "                                 in upper or lower case, means an individual or a legal entity exercising rights under,\n" +
   "                                 and complying with all of the terms of, this License.  For legal entities, \"You\" includes\n" +
   "                                 any entity that controls, is controlled by, or is under common control with you.\n" +
   "                                 For purposes of this definition, \"control\" means (i) the power, direct or indirect,\n" +
   "                                 to cause the direction or management of such entity, whether by contract or otherwise,\n" +
   "                                 or (ii) ownership of fifty percent (50%) or more of the outstanding shares, or (iii) beneficial\n" +
   "                                 ownership of such entity.\n" +
   "\n" +
   "                                 15) Right to Use. You may use the Original Work in all ways not otherwise \n" +
   "                                 restricted or conditioned by this License or by law, and Licensor promises not to\n" +
   "                                 interfere with or be responsible for such uses by You.\n" +
   "\n" +
   "                                 This license is Copyright (C) 2003 Lawrence E. Rosen.  All rights reserved.\n" +
   "                                 Permission is hereby granted to copy and distribute this license without modification.\n" +
   "                                 This license may not be modified without the express written permission of its copyright owner.\n" +
   "                                 ======================================================================\n" +
   "\n" +
   "                                 The Artistic License\n" +
   "                                 Preamble\n" +
   "\n" +
   "                                 The intent of this document is to state the conditions under which a Package\n" +
   "                                 may be copied, such that the Copyright Holder maintains some semblance of artistic control over\n" +
   "                                 the development of the package, while giving the users of the package the right to\n" +
   "                                 use and distribute the Package in a more-or-less customary fashion,\n" +
   "                                 plus the right to make reasonable modifications.\n" +
   "\n" +
   "                                 Definitions:\n" +
   "\n" +
   "                                \"Package\" refers to the collection of files distributed by the Copyright Holder, \n" +
   "                                 and derivatives of that collection of files created through textual modification.\n" +
   "                                \"Standard Version\" refers to such a Package if it has not been modified, \n" +
   "                                 or has been modified in accordance with the wishes of the Copyright Holder.\n" +
   "                                \"Copyright Holder\" is whoever is named in the copyright or copyrights for the package.\n" +
   "                                \"You\" is you, if you`re thinking about copying or distributing this Package.\n" +
   "                                \"Reasonable copying fee\" is whatever you can justify on the basis of media cost,\n" +
   "                                 duplication charges, time of people involved, and so on. \n" +
   "                                 (You will not be required to justify it to the Copyright Holder,\n" +
   "                                 but only to the computing community at large as a market that must bear the fee.)\n" +
   "                                \"Freely Available\" means that no fee is charged for the item itself, \n" +
   "                                 though there may be fees involved in handling the item. \n" +
   "                                 It also means that recipients of the item may redistribute it under the same conditions\n" +
   "                                 they received it.\n" +
   "                                 1. You may make and give away verbatim copies of the source form of the Standard Version\n" +
   "                                 of this Package without restriction, provided that you duplicate all of the original copyright\n" +
   "                                 notices and associated disclaimers.\n" +
   "\n" +
   "                                 2. You may apply bug fixes, portability fixes and other modifications derived \n" +
   "                                 from the Public Domain or from the Copyright Holder. A Package modified in such a way shall\n" +
   "                                 still be considered the Standard Version.\n" +
   "\n" +
   "                                 3. You may otherwise modify your copy of this Package in any way,\n" +
   "                                 provided that you insert a prominent notice in each changed file stating how and when you changed\n" +
   "                                 that file, and provided that you do at least ONE of the following:\n" +
   "\n" +
   "                                 a) place your modifications in the Public Domain or otherwise make them Freely Available,\n" +
   "                                 such as by posting said modifications to Usenet or an equivalent medium, or placing\n" +
   "                                 the modifications on a major archive site such as ftp.uu.net, \n" +
   "                                 or by allowing the Copyright Holder to include your modifications \n" +
   "                                 in the Standard Version of the Package.\n" +
   "\n" +
   "                                 b) use the modified Package only within your corporation or organization.\n" +
   "\n" +
   "                                 c) rename any non-standard executables so the names do not conflict with standard executables,\n" +
   "                                 which must also be provided, and provide a separate manual page for each non-standard executable\n" +
   "                                 that clearly documents how it differs from the Standard Version.\n" +
   "\n" +
   "                                 d) make other distribution arrangements with the Copyright Holder.\n" +
   "\n" +
   "                                 4. You may distribute the programs of this Package in object code or executable form, \n" +
   "                                 provided that you do at least ONE of the following:\n" +
   "\n" +
   "                                 a) distribute a Standard Version of the executables and library files, together with instructions\n" +
   "                                 (in the manual page or equivalent) on where to get the Standard Version.\n" +
   "\n" +
   "                                 b) accompany the distribution with the machine-readable source of the Package\n" +
   "                                 with your modifications.\n" +
   "\n" +
   "                                 c) accompany any non-standard executables with their corresponding Standard Version executables,\n" +
   "                                 giving the non-standard executables non-standard names,\n" +
   "                                 and clearly documenting the differences in manual pages (or equivalent),\n" +
   "                                 together with instructions on where to get the Standard Version.\n" +
   "\n" +
   "                                 d) make other distribution arrangements with the Copyright Holder.\n" +
   "\n" +
   "                                 5. You may charge a reasonable copying fee for any distribution of this Package. \n" +
   "                                 You may charge any fee you choose for support of this Package.\n" +
   "                                 You may not charge a fee for this Package itself. However, you may distribute this Package\n" +
   "                                 in aggregate with other (possibly commercial) programs as part of a larger (possibly commercial)\n" +
   "                                 software distribution provided that you do not advertise this Package as a product of your own.\n" +
   "\n" +
   "                                 6. The scripts and library files supplied as input to or produced as output \n" +
   "                                 from the programs of this Package do not automatically fall under the copyright of this Package,\n" +
   "                                 but belong to whomever generated them, and may be sold commercially,\n" +
   "                                 and may be aggregated with this Package.\n" +
   "\n" +
   "                                 7. C or perl subroutines supplied by you and linked into this Package shall not\n" +
   "                                 be considered part of this Package.\n" +
   "\n" +
   "                                 8. The name of the Copyright Holder may not be used to endorse or promote products \n" +
   "                                 derived from this software without specific prior written permission.\n" +
   "\n" +
   "                                 9. THIS PACKAGE IS PROVIDED \"AS IS\" AND WITHOUT ANY EXPRESS OR IMPLIED WARRANTIES,\n" +
   "                                 INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF MERCHANTIBILITY AND FITNESS\n" +
   "                                 FOR A PARTICULAR PURPOSE.\n" +
   "\n" +
   "                                 The End\n" +
   "                                 ======================================================================\n" +
   "\n" +
   "                                 The FreeBSD Copyright\n" +
   "\n" +
   "                                 Copyright 1992-2010 The FreeBSD Project. All rights reserved.\n" +
   "\n" +
   "                                 Redistribution and use in source and binary forms, with or without modification,\n" +
   "                                 are permitted provided that the following conditions are met:\n" +
   "\n" +
   "                                 Redistributions of source code must retain the above copyright notice,\n" +
   "                                 this list of conditions and the following disclaimer.\n" +
   "                                 Redistributions in binary form must reproduce the above copyright notice, \n" +
   "                                 this list of conditions and the following disclaimer in the documentation and/or other\n" +
   "                                 materials provided with the distribution.\n" +
   "                                 THIS SOFTWARE IS PROVIDED BY THE FREEBSD PROJECT ``AS IS`` AND ANY EXPRESS OR IMPLIED\n" +
   "                                 WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS\n" +
   "                                 FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE FREEBSD PROJECT OR CONTRIBUTORS\n" +
   "                                 BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR \n" +
   "                                 CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR\n" +
   "                                 SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED \n" +
   "                                 AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, \n" +
   "                                 OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,\n" +
   "                                 EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n" +
   "\n" +
   "                                 The views and conclusions contained in the software and documentation are those of the authors\n" +
   "                                 and should not be interpreted as representing official policies, either expressed or implied,\n" +
   "                                 of the FreeBSD Project.\n" +
   "                                 ======================================================================\n" +
   "\n" +
   "                                 Copyright (c) The Regents of the University of California.\n" +
   "                                 All rights reserved.\n" +
   "\n" +
   "                                 Redistribution and use in source and binary forms, with or without\n" +
   "                                 modification, are permitted provided that the following conditions\n" +
   "                                 are met:\n" +
   "                                 1. Redistributions of source code must retain the above copyright\n" +
   "                                 notice, this list of conditions and the following disclaimer.\n" +
   "                                 2. Redistributions in binary form must reproduce the above copyright\n" +
   "                                 notice, this list of conditions and the following disclaimer in the\n" +
   "                                 documentation and/or other materials provided with the distribution.\n" +
   "                                 3. Neither the name of the University nor the names of its contributors\n" +
   "                                 may be used to endorse or promote products derived from this software\n" +
   "                                 without specific prior written permission.\n" +
   "\n" +
   "                                 THIS SOFTWARE IS PROVIDED BY THE REGENTS AND CONTRIBUTORS ``AS IS'' AND\n" +
   "                                 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE\n" +
   "                                 IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE\n" +
   "                                 ARE DISCLAIMED.  IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE\n" +
   "                                 FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL\n" +
   "                                 DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS\n" +
   "                                 OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)\n" +
   "                                 HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT\n" +
   "                                 LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY\n" +
   "                                 OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF\n" +
   "                                 SUCH DAMAGE.\n" +
   "                                 ======================================================================\n" +
   "\n" +
   "                                 Copyright (c) 1993 The Regents of the University of California. All\n" +
   "                                 rights reserved.\n" +
   "\n" +
   "                                 This software was developed by the Computer Systems Engineering group\n" +
   "                                 at Lawrence Berkeley Laboratory under DARPA contract BG 91-66 and\n" +
   "                                 contributed to Berkeley.\n" +
   "\n" +
   "                                 All advertising materials mentioning features or use of this software\n" +
   "                                 must display the following acknowledgement: This product includes\n" +
   "                                 software developed by the University of California, Lawrence Berkeley\n" +
   "                                 Laboratory.\n" +
   "\n" +
   "                                 Redistribution and use in source and binary forms, with or without\n" +
   "                                 modification, are permitted provided that the following conditions are\n" +
   "                                 met:\n" +
   "\n" +
   "                                 1. Redistributions of source code must retain the above copyright\n" +
   "                                 notice, this list of conditions and the following disclaimer.\n" +
   "\n" +
   "                                 2. Redistributions in binary form must reproduce the above copyright\n" +
   "                                 notice, this list of conditions and the following disclaimer in\n" +
   "                                 the documentation and/or other materials provided with the\n" +
   "                                 distribution.\n" +
   "\n" +
   "                                 3. All advertising materials mentioning features or use of this\n" +
   "                                 software must display the following acknowledgement: This product\n" +
   "                                 includes software developed by the University of California,\n" +
   "                                 Berkeley and its contributors.\n" +
   "\n" +
   "                                 4. Neither the name of the University nor the names of its\n" +
   "                                 contributors may be used to endorse or promote products derived\n" +
   "                                 from this software without specific prior written permission.\n" +
   "\n" +
   "                                 THIS SOFTWARE IS PROVIDED BY THE REGENTS AND CONTRIBUTORS ``AS IS''\n" +
   "                                 AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,\n" +
   "                                 THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR\n" +
   "                                 PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS\n" +
   "                                 BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR\n" +
   "                                 CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF\n" +
   "                                 SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR\n" +
   "                                 BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,\n" +
   "                                 WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE\n" +
   "                                 OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN\n" +
   "                                 IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. \n" +
   "                                 ======================================================================\n" +
   "\n" +
   "                                 Copyright (c) 1999-2007, The Board of Trustees of the University of Illinois\n" +
   "                                 All Rights Reserved.\n" +
   "\n" +
   "                                 Iperf performance test\n" +
   "                                 Mark Gates\n" +
   "                                 Ajay Tirumala\n" +
   "                                 Jim Ferguson\n" +
   "                                 Jon Dugan\n" +
   "                                 Feng Qin\n" +
   "                                 Kevin Gibbs\n" +
   "                                 John Estabrook\n" +
   "                                 National Laboratory for Applied Network Research\n" + 
   "                                 National Center for Supercomputing Applications \n" +
   "                                 University of Illinois at Urbana-Champaign \n" +
   "                                 http://www.ncsa.uiuc.edu\n" +
   "\n" +
   "                                 Permission is hereby granted, free of charge, to any person obtaining a copy\n" +
   "                                 of this software (Iperf) and associated documentation files (the \"Software\"),\n" +
   "                                 to deal in the Software without restriction, including without limitation the\n" +
   "                                 rights to use, copy, modify, merge, publish, distribute, sublicense, and/or\n" +
   "                                 sell copies of the Software, and to permit persons to whom the Software is\n" +
   "                                 furnished to do so, subject to the following conditions:\n" +
   "\n" +
   "\n" +
   "                                 Redistributions of source code must retain the above copyright notice, this\n" +
   "                                 list of conditions and the following disclaimers.\n" +
   "\n" +
   "                                 Redistributions in binary form must reproduce the above copyright notice, this\n" +
   "                                 list of conditions and the following disclaimers in the documentation and/or\n" +
   "                                 other materials provided with the distribution.\n" +
   "\n" +
   "                                 Neither the names of the University of Illinois, NCSA, nor the names of its\n" +
   "                                 contributors may be used to endorse or promote products derived from this\n" +
   "                                 Software without specific prior written permission.  THE SOFTWARE IS PROVIDED\n" +
   "                                 \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT\n" +
   "                                 LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE\n" +
   "                                 AND NONINFRINGEMENT. IN NO EVENT SHALL THE CONTIBUTORS OR COPYRIGHT HOLDERS BE\n" +
   "                                 LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF\n" +
   "                                 CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE\n" +
   "                                 SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n" +
   "                                 ======================================================================\n" +
   "\n" +
   "                                 Permission is hereby granted, free of charge, to any person or organization\n" +
   "                                 obtaining a copy of the software and accompanying documentation covered\n" +
   "                                 by this license (the \"Software\") to use, reproduce, display, distribute,\n" +
   "                                 execute, and transmit the Software, and to prepare derivative works of the Software,\n" +
   "                                 and to permit third-parties to whom the Software is furnished to do so,\n" +
   "                                 all subject to the following:\n" +
   "\n" +
   "                                 The copyright notices in the Software and this entire statement, \n" +
   "                                 including the above license grant, this restriction and the following disclaimer,\n" +
   "                                 must be included in all copies of the Software, in whole or in part, and all derivative works \n" +
   "                                 of the Software, unless such copies or derivative works are solely in the form of \n" +
   "                                 machine-executable object code generated by a source language processor.\n" +
   "\n" +
   "                                 THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,\n" +
   "                                 INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,\n" +
   "                                 TITLE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE COPYRIGHT HOLDERS OR ANYONE\n" +
   "                                 DISTRIBUTING THE SOFTWARE BE LIABLE FOR ANY DAMAGES OR OTHER LIABILITY, WHETHER IN CONTRACT,\n" +
   "                                 TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE\n" +
   "                                 OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n" +
   "                                 ======================================================================\n" +
   "\n" +
   "                                                      GNU GENERAL PUBLIC LICENSE\n" +
   "                                                       Version 1, February 1989\n" +
   "\n" +
   "                                   Copyright (C) 1989 Free Software Foundation, Inc.\n" +
   "                                                      51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA\n" +
   "                                   Everyone is permitted to copy and distribute verbatim copies\n" +
   "                                   of this license document, but changing it is not allowed.\n" +
   "\n" +
   "                                                              Preamble\n" +
   "\n" +
   "                                    The license agreements of most software companies try to keep users\n" +
   "                                  at the mercy of those companies.  By contrast, our General Public\n" +
   "                                  License is intended to guarantee your freedom to share and change free\n" +
   "                                  software--to make sure the software is free for all its users.  The\n" +
   "                                  General Public License applies to the Free Software Foundation's\n" +
   "                                  software and to any other program whose authors commit to using it.\n" +
   "                                  You can use it for your programs, too.\n" +
   "\n" +
   "                                    When we speak of free software, we are referring to freedom, not\n" +
   "                                  price.  Specifically, the General Public License is designed to make\n" +
   "                                  sure that you have the freedom to give away or sell copies of free\n" +
   "                                  software, that you receive source code or can get it if you want it,\n" +
   "                                  that you can change the software or use pieces of it in new free\n" +
   "                                  programs; and that you know you can do these things.\n" +
   "\n" +
   "                                    To protect your rights, we need to make restrictions that forbid\n" +
   "                                  anyone to deny you these rights or to ask you to surrender the rights.\n" +
   "                                  These restrictions translate to certain responsibilities for you if you\n" +
   "                                  distribute copies of the software, or if you modify it.\n" +
   "\n" +
   "                                    For example, if you distribute copies of a such a program, whether\n" +
   "                                  gratis or for a fee, you must give the recipients all the rights that\n" +
   "                                  you have.  You must make sure that they, too, receive or can get the\n" +
   "                                  source code.  And you must tell them their rights.\n" +
   "\n" +
   "                                    We protect your rights with two steps: (1) copyright the software, and\n" +
   "                                  (2) offer you this license which gives you legal permission to copy,\n" +
   "                                  distribute and/or modify the software.\n" +
   "\n" +
   "                                    Also, for each author's protection and ours, we want to make certain\n" +
   "                                  that everyone understands that there is no warranty for this free\n" +
   "                                  software.  If the software is modified by someone else and passed on, we\n" +
   "                                  want its recipients to know that what they have is not the original, so\n" +
   "                                  that any problems introduced by others will not reflect on the original\n" +
   "                                  authors' reputations.\n" +
   "\n" +
   "                                    The precise terms and conditions for copying, distribution and\n" +
   "                                  modification follow.\n" +
   "\n" +
   "                                                      GNU GENERAL PUBLIC LICENSE\n" +
   "                                     TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION\n" +
   "\n" +
   "                                    0. This License Agreement applies to any program or other work which\n" +
   "                                  contains a notice placed by the copyright holder saying it may be\n" +
   "                                  distributed under the terms of this General Public License.  The\n" +
   "                                  \"Program\", below, refers to any such program or work, and a\"work based\n" +
   "                                  on the Program\" means either the Program or any work containing the\n" +
   "                                  Program or a portion of it, either verbatim or with modifications.  Each\n" +
   "                                  licensee is addressed as \"you\".\n" +
   "\n" +
   "                                    1. You may copy and distribute verbatim copies of the Program's source\n" +
   "                                  code as you receive it, in any medium, provided that you conspicuously and\n" +
   "                                  appropriately publish on each copy an appropriate copyright notice and\n" +
   "                                  disclaimer of warranty; keep intact all the notices that refer to this\n" +
   "                                  General Public License and to the absence of any warranty; and give any\n" +
   "                                  other recipients of the Program a copy of this General Public License\n" +
   "                                  along with the Program.  You may charge a fee for the physical act of\n" +
   "                                  transferring a copy.\n" +
   "\n" +
   "                                    2. You may modify your copy or copies of the Program or any portion of\n" +
   "                                  it, and copy and distribute such modifications under the terms of Paragraph\n" +
   "                                  1 above, provided that you also do the following:\n" +
   "\n" +
   "                                      a) cause the modified files to carry prominent notices stating that\n" +
   "                                      you changed the files and the date of any change; and\n" +
   "\n" +
   "                                      b) cause the whole of any work that you distribute or publish, that\n" +
   "                                      in whole or in part contains the Program or any part thereof, either\n" +
   "                                      with or without modifications, to be licensed at no charge to all\n" +
   "                                      third parties under the terms of this General Public License (except\n" +
   "                                      that you may choose to grant warranty protection to some or all\n" +
   "                                      third parties, at your option).\n" +
   "\n" +
   "                                      c) If the modified program normally reads commands interactively when\n" +
   "                                      run, you must cause it, when started running for such interactive use\n" +
   "                                      in the simplest and most usual way, to print or display an\n" +
   "                                      announcement including an appropriate copyright notice and a notice\n" +
   "                                      that there is no warranty (or else, saying that you provide a\n" +
   "                                      warranty) and that users may redistribute the program under these\n" +
   "                                      conditions, and telling the user how to view a copy of this General\n" +
   "                                      Public License.\n" +
   "\n" +
   "                                      d) You may charge a fee for the physical act of transferring a\n" +
   "                                      copy, and you may at your option offer warranty protection in\n" +
   "                                      exchange for a fee.\n" +
   "\n" +
   "                                  Mere aggregation of another independent work with the Program (or its\n" +
   "                                  derivative) on a volume of a storage or distribution medium does not bring\n" +
   "                                  the other work under the scope of these terms.\n" +
   "\n" +
   "                                    3. You may copy and distribute the Program (or a portion or derivative of\n" +
   "                                  it, under Paragraph 2) in object code or executable form under the terms of\n" +
   "                                  Paragraphs 1 and 2 above provided that you also do one of the following:\n" +
   "\n" +
   "                                      a) accompany it with the complete corresponding machine-readable\n" +
   "                                      source code, which must be distributed under the terms of\n" +
   "                                      Paragraphs 1 and 2 above; or,\n" +
   "\n" +
   "                                      b) accompany it with a written offer, valid for at least three\n" +
   "                                      years, to give any third party free (except for a nominal charge\n" +
   "                                      for the cost of distribution) a complete machine-readable copy of the\n" +
   "                                      corresponding source code, to be distributed under the terms of\n" +
   "                                      Paragraphs 1 and 2 above; or,\n" +
   "\n" +
   "                                      c) accompany it with the information you received as to where the\n" +
   "                                      corresponding source code may be obtained.  (This alternative is\n" +
   "                                      allowed only for noncommercial distribution and only if you\n" +
   "                                      received the program in object code or executable form alone.)\n" +
   "\n" +
   "                                  Source code for a work means the preferred form of the work for making\n" +
   "                                  modifications to it.  For an executable file, complete source code means\n" +
   "                                  all the source code for all modules it contains; but, as a special\n" +
   "                                  exception, it need not include source code for modules which are standard\n" +
   "                                  libraries that accompany the operating system on which the executable\n" +
   "                                  file runs, or for standard header files or definitions files that\n" +
   "                                  accompany that operating system.\n" +
   "\n" +
   "                                    4. You may not copy, modify, sublicense, distribute or transfer the\n" +
   "                                  Program except as expressly provided under this General Public License.\n" +
   "                                  Any attempt otherwise to copy, modify, sublicense, distribute or transfer\n" +
   "                                  the Program is void, and will automatically terminate your rights to use\n" +
   "                                  the Program under this License.  However, parties who have received\n" +
   "                                  copies, or rights to use copies, from you under this General Public\n" +
   "                                  License will not have their licenses terminated so long as such parties\n" +
   "                                  remain in full compliance.\n" +
   "\n" +
   "                                    5. By copying, distributing or modifying the Program (or any work based\n" +
   "                                  on the Program) you indicate your acceptance of this license to do so,\n" +
   "                                  and all its terms and conditions.\n" +
   "\n" +
   "                                    6. Each time you redistribute the Program (or any work based on the\n" +
   "                                  Program), the recipient automatically receives a license from the original\n" +
   "                                  licensor to copy, distribute or modify the Program subject to these\n" +
   "                                  terms and conditions.  You may not impose any further restrictions on the\n" +
   "                                  recipients' exercise of the rights granted herein.\n" +
   "\n" +
   "                                    7. The Free Software Foundation may publish revised and/or new versions\n" +
   "                                  of the General Public License from time to time.  Such new versions will\n" +
   "                                  be similar in spirit to the present version, but may differ in detail to\n" +
   "                                  address new problems or concerns.\n" +
   "\n" +
   "                                  Each version is given a distinguishing version number.  If the Program\n" +
   "                                  specifies a version number of the license which applies to it and \"any\n" +
   "                                  later version\", you have the option of following the terms and conditions\n" +
   "                                  either of that version or of any later version published by the Free\n" +
   "                                  Software Foundation.  If the Program does not specify a version number of\n" +
   "                                  the license, you may choose any version ever published by the Free Software\n" +
   "                                  Foundation.\n" +
   "\n" +
   "                                    8. If you wish to incorporate parts of the Program into other free\n" +
   "                                  programs whose distribution conditions are different, write to the author\n" +
   "                                  to ask for permission.  For software which is copyrighted by the Free\n" +
   "                                  Software Foundation, write to the Free Software Foundation; we sometimes\n" +
   "                                  make exceptions for this.  Our decision will be guided by the two goals\n" +
   "                                  of preserving the free status of all derivatives of our free software and\n" +
   "                                  of promoting the sharing and reuse of software generally.\n" +
   "\n" +
   "                                                              NO WARRANTY\n" +
   "\n" +
   "                                    9. BECAUSE THE PROGRAM IS LICENSED FREE OF CHARGE, THERE IS NO WARRANTY\n" +
   "                                  FOR THE PROGRAM, TO THE EXTENT PERMITTED BY APPLICABLE LAW.  EXCEPT WHEN\n" +
   "                                  OTHERWISE STATED IN WRITING THE COPYRIGHT HOLDERS AND/OR OTHER PARTIES\n" +
   "                                  PROVIDE THE PROGRAM \"AS IS\" WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED\n" +
   "                                  OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF\n" +
   "                                  MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.  THE ENTIRE RISK AS\n" +
   "                                  TO THE QUALITY AND PERFORMANCE OF THE PROGRAM IS WITH YOU.  SHOULD THE\n" +
   "                                  PROGRAM PROVE DEFECTIVE, YOU ASSUME THE COST OF ALL NECESSARY SERVICING,\n" +
   "                                  REPAIR OR CORRECTION.\n" +
   "\n" +
   "                                    10. IN NO EVENT UNLESS REQUIRED BY APPLICABLE LAW OR AGREED TO IN WRITING\n" +
   "                                  WILL ANY COPYRIGHT HOLDER, OR ANY OTHER PARTY WHO MAY MODIFY AND/OR\n" +
   "                                  REDISTRIBUTE THE PROGRAM AS PERMITTED ABOVE, BE LIABLE TO YOU FOR DAMAGES,\n" +
   "                                  INCLUDING ANY GENERAL, SPECIAL, INCIDENTAL OR CONSEQUENTIAL DAMAGES ARISING\n" +
   "                                  OUT OF THE USE OR INABILITY TO USE THE PROGRAM (INCLUDING BUT NOT LIMITED\n" +
   "                                  TO LOSS OF DATA OR DATA BEING RENDERED INACCURATE OR LOSSES SUSTAINED BY\n" +
   "                                  YOU OR THIRD PARTIES OR A FAILURE OF THE PROGRAM TO OPERATE WITH ANY OTHER\n" +
   "                                  PROGRAMS), EVEN IF SUCH HOLDER OR OTHER PARTY HAS BEEN ADVISED OF THE\n" +
   "                                  POSSIBILITY OF SUCH DAMAGES.\n" +
   "\n" +
   "                                                       END OF TERMS AND CONDITIONS\n" +
   "\n" +
   "                                          Appendix: How to Apply These Terms to Your New Programs\n" +
   "\n" +
   "                                    If you develop a new program, and you want it to be of the greatest\n" +
   "                                  possible use to humanity, the best way to achieve this is to make it\n" +
   "                                  free software which everyone can redistribute and change under these\n" +
   "                                  terms.\n" +
   "\n" +
   "                                    To do so, attach the following notices to the program.  It is safest to\n" +
   "                                  attach them to the start of each source file to most effectively convey\n" +
   "                                  the exclusion of warranty; and each file should have at least the\n" +
   "                                  \"copyright\" line and a pointer to where the full notice is found.\n" +
   "\n" +
   "                                      <one line to give the program's name and a brief idea of what it does.>\n" +
   "                                      Copyright (C) 19yy  <name of author>\n" +
   "\n" +
   "                                      This program is free software; you can redistribute it and/or modify\n" +
   "                                      it under the terms of the GNU General Public License as published by\n" +
   "                                      the Free Software Foundation; either version 1, or (at your option)\n" +
   "                                      any later version.\n" +
   "\n" +
   "                                      This program is distributed in the hope that it will be useful,\n" +
   "                                      but WITHOUT ANY WARRANTY; without even the implied warranty of\n" +
   "                                      MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\n" +
   "                                      GNU General Public License for more details.\n" +
   "\n" +
   "                                      You should have received a copy of the GNU General Public License\n" +
   "                                      along with this program; if not, write to the Free Software\n" +
   "                                      Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston MA  02110-1301 USA.\n" +
   "\n" +
   "                                  Also add information on how to contact you by electronic and paper mail.\n" +
   "\n" +
   "                                  If the program is interactive, make it output a short notice like this\n" +
   "                                  when it starts in an interactive mode:\n" +
   "\n" +
   "                                      Gnomovision version 69, Copyright (C) 19xx name of author\n" +
   "                                      Gnomovision comes with ABSOLUTELY NO WARRANTY; for details type `show w'.\n" +
   "                                      This is free software, and you are welcome to redistribute it\n" +
   "                                      under certain conditions; type `show c' for details.\n" +
   "\n" +
   "                                  The hypothetical commands `show w' and `show c' should show the\n" +
   "                                  appropriate parts of the General Public License.  Of course, the\n" +
   "                                  commands you use may be called something other than `show w' and `show\n" +
   "                                  c'; they could even be mouse-clicks or menu items--whatever suits your\n" +
   "                                  program.\n" +
   "\n" + 
   "                                  You should also get your employer (if you work as a programmer) or your\n" +
   "                                  school, if any, to sign a \"copyright disclaimer\" for the program, if\n" +
   "                                  necessary.  Here a sample; alter the names:\n" +
   "\n" +
   "                                    Yoyodyne, Inc., hereby disclaims all copyright interest in the\n" +
   "                                    program `Gnomovision' (a program to direct compilers to make passes\n" +
   "                                    at assemblers) written by James Hacker.\n" +
   "\n" +
   "                                    <signature of Ty Coon>, 1 April 1989\n" +
   "                                    Ty Coon, President of Vice\n" +
   "\n" +
   "                                  That's all there is to it!\n" +
    "                                ======================================================================\n" +
    "\n" +
    "                                            GNU GENERAL PUBLIC LICENSE\n" +
    "                                               Version 2, June 1991\n" +
    "\n" +
    "                                 Copyright (C) 1989, 1991 Free Software Foundation, Inc.\n" +
    "                                     59 Temple Place, Suite 330, Boston, MA 02111-1307, USA\n" +
    "                                 Everyone is permitted to copy and distribute verbatim copies\n" +
    "                                 of this license document, but changing it is not allowed.\n" +
    "\n" +
    "                                The Free Software Foundation has exempted Bash from the requirement of\n" +
    "                                Paragraph 2c of the General Public License.  This is to say, there is\n" +
    "                                no requirement for Bash to print a notice when it is started\n" +
    "                                interactively in the usual way.  We made this exception because users\n" +
    "                                and standards expect shells not to print such messages.  This\n" +
    "                                exception applies to any program that serves as a shell and that is\n" +
    "                                based primarily on Bash as opposed to other GNU software.\n" +
    "\n" +
    "                                                Preamble\n" +
    "\n" +
    "                                  The licenses for most software are designed to take away your\n" +
    "                                freedom to share and change it.  By contrast, the GNU General Public\n" +
    "                                License is intended to guarantee your freedom to share and change free\n" +
    "                                software--to make sure the software is free for all its users.  This\n" +
    "                                General Public License applies to most of the Free Software\n" +
    "                                Foundation's software and to any other program whose authors commit to\n" +
    "                                using it.  (Some other Free Software Foundation software is covered by\n" +
    "                                the GNU Library General Public License instead.)  You can apply it to\n" +
    "                                your programs, too.\n" +
    "\n" +
    "                                  When we speak of free software, we are referring to freedom, not\n" +
    "                                price.  Our General Public Licenses are designed to make sure that you\n" +
    "                                have the freedom to distribute copies of free software (and charge for\n" +
    "                                this service if you wish), that you receive source code or can get it\n" +
    "                                if you want it, that you can change the software or use pieces of it\n" +
    "                                in new free programs; and that you know you can do these things.\n" +
    "\n" +
    "                                  To protect your rights, we need to make restrictions that forbid\n" +
    "                                anyone to deny you these rights or to ask you to surrender the rights.\n" +
    "                                These restrictions translate to certain responsibilities for you if you\n" +
    "                                distribute copies of the software, or if you modify it.\n" +
    "\n" +
    "                                  For example, if you distribute copies of such a program, whether\n" +
    "                                gratis or for a fee, you must give the recipients all the rights that\n" +
    "                                you have.  You must make sure that they, too, receive or can get the\n" +
    "                                source code.  And you must show them these terms so they know their\n" +
    "                                rights.\n" +
    "\n" +
    "                                  We protect your rights with two steps: (1) copyright the software, and\n" +
    "                                (2) offer you this license which gives you legal permission to copy,\n" +
    "                                distribute and/or modify the software.\n" +
    "\n" +
    "                                  Also, for each author's protection and ours, we want to make certain\n" +
    "                                that everyone understands that there is no warranty for this free\n" +
    "                                software.  If the software is modified by someone else and passed on, we\n" +
    "                                want its recipients to know that what they have is not the original, so\n" +
    "                                that any problems introduced by others will not reflect on the original\n" +
    "                                authors' reputations.\n" +
    "\n" +
    "                                  Finally, any free program is threatened constantly by software\n" +
    "                                patents.  We wish to avoid the danger that redistributors of a free\n" +
    "                                program will individually obtain patent licenses, in effect making the\n" +
    "                                program proprietary.  To prevent this, we have made it clear that any\n" +
    "                                patent must be licensed for everyone's free use or not licensed at all.\n" +
    "\n" +
    "                                  The precise terms and conditions for copying, distribution and\n" +
    "                                modification follow.\n" +
    "\n" +
    "                                            GNU GENERAL PUBLIC LICENSE\n" +
    "                                   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION\n" +
    "\n" +
    "                                  0. This License applies to any program or other work which contains\n" +
    "                                a notice placed by the copyright holder saying it may be distributed\n" +
    "                                under the terms of this General Public License.  The \"Program\", below,\n" +
    "                                refers to any such program or work, and a \"work based on the Program\"\n" +
    "                                means either the Program or any derivative work under copyright law:\n" +
    "                                that is to say, a work containing the Program or a portion of it,\n" +
    "                                either verbatim or with modifications and/or translated into another\n" +
    "                                language.  (Hereinafter, translation is included without limitation in\n" +
    "                                the term \"modification\".)  Each licensee is addressed as \"you\".\n" +
    "\n" +
    "                                Activities other than copying, distribution and modification are not\n" +
    "                                covered by this License; they are outside its scope.  The act of\n" +
    "                                running the Program is not restricted, and the output from the Program\n" +
    "                                is covered only if its contents constitute a work based on the\n" +
    "                                Program (independent of having been made by running the Program).\n" +
    "                                Whether that is true depends on what the Program does.\n" +
    "\n" +
    "                                  1. You may copy and distribute verbatim copies of the Program's\n" +
    "                                source code as you receive it, in any medium, provided that you\n" +
    "                                conspicuously and appropriately publish on each copy an appropriate\n" +
    "                                copyright notice and disclaimer of warranty; keep intact all the\n" +
    "                                notices that refer to this License and to the absence of any warranty;\n" +
    "                                and give any other recipients of the Program a copy of this License\n" +
    "                                along with the Program.\n" +
    "\n" +
    "                                You may charge a fee for the physical act of transferring a copy, and\n" +
    "                                you may at your option offer warranty protection in exchange for a fee.\n" +
    "\n" +
    "                                  2. You may modify your copy or copies of the Program or any portion\n" +
    "                                of it, thus forming a work based on the Program, and copy and\n" +
    "                                distribute such modifications or work under the terms of Section 1\n" +
    "                                above, provided that you also meet all of these conditions:\n" +
    "\n" +
    "                                    a) You must cause the modified files to carry prominent notices\n" +
    "                                    stating that you changed the files and the date of any change.\n" +
    "\n" +
    "                                    b) You must cause any work that you distribute or publish, that in\n" +
    "                                    whole or in part contains or is derived from the Program or any\n" +
    "                                    part thereof, to be licensed as a whole at no charge to all third\n" +
    "                                    parties under the terms of this License.\n" +
    "\n" +
    "                                    c) If the modified program normally reads commands interactively\n" +
    "                                    when run, you must cause it, when started running for such\n" +
    "                                    interactive use in the most ordinary way, to print or display an\n" +
    "                                    announcement including an appropriate copyright notice and a\n" +
    "                                    notice that there is no warranty (or else, saying that you provide\n" +
    "                                    a warranty) and that users may redistribute the program under\n" +
    "                                    these conditions, and telling the user how to view a copy of this\n" +
    "                                    License.  (Exception: if the Program itself is interactive but\n" +
    "                                    does not normally print such an announcement, your work based on\n" +
    "                                    the Program is not required to print an announcement.)\n" +
    "\n" +
    "                                These requirements apply to the modified work as a whole.  If\n" +
    "                                identifiable sections of that work are not derived from the Program,\n" +
    "                                and can be reasonably considered independent and separate works in\n" +
    "                                themselves, then this License, and its terms, do not apply to those\n" +
    "                                sections when you distribute them as separate works.  But when you\n" +
    "                                distribute the same sections as part of a whole which is a work based\n" +
    "                                on the Program, the distribution of the whole must be on the terms of\n" +
    "                                this License, whose permissions for other licensees extend to the\n" +
    "                                entire whole, and thus to each and every part regardless of who wrote it.\n" +
    "\n" +
    "                                Thus, it is not the intent of this section to claim rights or contest\n" +
    "                                your rights to work written entirely by you; rather, the intent is to\n" +
    "                                exercise the right to control the distribution of derivative or\n" +
    "                                collective works based on the Program.\n" +
    "\n" +
    "                                In addition, mere aggregation of another work not based on the Program\n" +
    "                                with the Program (or with a work based on the Program) on a volume of\n" +
    "                                a storage or distribution medium does not bring the other work under\n" +
    "                                the scope of this License.\n" +
    "\n" +
    "                                  3. You may copy and distribute the Program (or a work based on it,\n" +
    "                                under Section 2) in object code or executable form under the terms of\n" +
    "                                Sections 1 and 2 above provided that you also do one of the following:\n" +
    "\n" +
    "                                    a) Accompany it with the complete corresponding machine-readable\n" +
    "                                    source code, which must be distributed under the terms of Sections\n" +
    "                                    1 and 2 above on a medium customarily used for software interchange; or,\n" +
    "\n" +
    "                                    b) Accompany it with a written offer, valid for at least three\n" +
    "                                    years, to give any third party, for a charge no more than your\n" +
    "                                    cost of physically performing source distribution, a complete\n" +
    "                                    machine-readable copy of the corresponding source code, to be\n" +
    "                                    distributed under the terms of Sections 1 and 2 above on a medium\n" +
    "                                    customarily used for software interchange; or,\n" +
    "\n" +
    "                                    c) Accompany it with the information you received as to the offer\n" +
    "                                    to distribute corresponding source code.  (This alternative is\n" +
    "                                    allowed only for noncommercial distribution and only if you\n" +
    "                                    received the program in object code or executable form with such\n" +
    "                                    an offer, in accord with Subsection b above.)\n" +
    "\n" +
    "                                The source code for a work means the preferred form of the work for\n" +
    "                                making modifications to it.  For an executable work, complete source\n" +
    "                                code means all the source code for all modules it contains, plus any\n" +
    "                                associated interface definition files, plus the scripts used to\n" +
    "                                control compilation and installation of the executable.  However, as a\n" +
    "                                special exception, the source code distributed need not include\n" +
    "                                anything that is normally distributed (in either source or binary\n" +
    "                                form) with the major components (compiler, kernel, and so on) of the\n" +
    "                                operating system on which the executable runs, unless that component\n" +
    "                                itself accompanies the executable.\n" +
    "\n" +
    "                                If distribution of executable or object code is made by offering\n" +
    "                                access to copy from a designated place, then offering equivalent\n" +
    "                                access to copy the source code from the same place counts as\n" +
    "                                distribution of the source code, even though third parties are not\n" +
    "                                compelled to copy the source along with the object code.\n" +
    "\n" +
    "                                  4. You may not copy, modify, sublicense, or distribute the Program\n" +
    "                                except as expressly provided under this License.  Any attempt\n" +
    "                                otherwise to copy, modify, sublicense or distribute the Program is\n" +
    "                                void, and will automatically terminate your rights under this License.\n" +
    "                                However, parties who have received copies, or rights, from you under\n" +
    "                                this License will not have their licenses terminated so long as such\n" +
    "                                parties remain in full compliance.\n" +
    "\n" +
    "                                  5. You are not required to accept this License, since you have not\n" +
    "                                signed it.  However, nothing else grants you permission to modify or\n" +
    "                                distribute the Program or its derivative works.  These actions are\n" +
    "                                prohibited by law if you do not accept this License.  Therefore, by\n" +
    "                                modifying or distributing the Program (or any work based on the\n" +
    "                                Program), you indicate your acceptance of this License to do so, and\n" +
    "                                all its terms and conditions for copying, distributing or modifying\n" +
    "                                the Program or works based on it.\n" +
    "\n" +
    "                                  6. Each time you redistribute the Program (or any work based on the\n" +
    "                                Program), the recipient automatically receives a license from the\n" +
    "                                original licensor to copy, distribute or modify the Program subject to\n" +
    "                                these terms and conditions.  You may not impose any further\n" +
    "                                restrictions on the recipients' exercise of the rights granted herein.\n" +
    "                                You are not responsible for enforcing compliance by third parties to\n" +
    "                                this License.\n" +
    "\n" +
    "                                  7. If, as a consequence of a court judgment or allegation of patent\n" +
    "                                infringement or for any other reason (not limited to patent issues),\n" +
    "                                conditions are imposed on you (whether by court order, agreement or\n" +
    "                                otherwise) that contradict the conditions of this License, they do not\n" +
    "                                excuse you from the conditions of this License.  If you cannot\n" +
    "                                distribute so as to satisfy simultaneously your obligations under this\n" +
    "                                License and any other pertinent obligations, then as a consequence you\n" +
    "                                may not distribute the Program at all.  For example, if a patent\n" +
    "                                license would not permit royalty-free redistribution of the Program by\n" +
    "                                all those who receive copies directly or indirectly through you, then\n" +
    "                                the only way you could satisfy both it and this License would be to\n" +
    "                                refrain entirely from distribution of the Program.\n" +
    "\n" +
    "                                If any portion of this section is held invalid or unenforceable under\n" +
    "                                any particular circumstance, the balance of the section is intended to\n" +
    "                                apply and the section as a whole is intended to apply in other\n" +
    "                                circumstances.\n" +
    "\n" +
    "                                It is not the purpose of this section to induce you to infringe any\n" +
    "                                patents or other property right claims or to contest validity of any\n" +
    "                                such claims; this section has the sole purpose of protecting the\n" +
    "                                integrity of the free software distribution system, which is\n" +
    "                                implemented by public license practices.  Many people have made\n" +
    "                                generous contributions to the wide range of software distributed\n" +
    "                                through that system in reliance on consistent application of that\n" +
    "                                system; it is up to the author/donor to decide if he or she is willing\n" +
    "                                to distribute software through any other system and a licensee cannot\n" +
    "                                impose that choice.\n" +
    "\n" +
    "                                This section is intended to make thoroughly clear what is believed to\n" +
    "                                be a consequence of the rest of this License.\n" +
    "\n" +
    "                                  8. If the distribution and/or use of the Program is restricted in\n" +
    "                                certain countries either by patents or by copyrighted interfaces, the\n" +
    "                                original copyright holder who places the Program under this License\n" +
    "                                may add an explicit geographical distribution limitation excluding\n" +
    "                                those countries, so that distribution is permitted only in or among\n" +
    "                                countries not thus excluded.  In such case, this License incorporates\n" +
    "                                the limitation as if written in the body of this License.\n" +
    "\n" +
    "                                  9. The Free Software Foundation may publish revised and/or new versions\n" +
    "                                of the General Public License from time to time.  Such new versions will\n" +
    "                                be similar in spirit to the present version, but may differ in detail to\n" +
    "                                address new problems or concerns.\n" +
    "\n" +
    "                                Each version is given a distinguishing version number.  If the Program\n" +
    "                                specifies a version number of this License which applies to it and \"any\n" +
    "                                later version\", you have the option of following the terms and conditions\n" +
    "                                either of that version or of any later version published by the Free\n" +
    "                                Software Foundation.  If the Program does not specify a version number of\n" +
    "                                this License, you may choose any version ever published by the Free Software\n" +
    "                                Foundation.\n" +
    "\n" +
    "                                  10. If you wish to incorporate parts of the Program into other free\n" +
    "                                programs whose distribution conditions are different, write to the author\n" +
    "                                to ask for permission.  For software which is copyrighted by the Free\n" +
    "                                Software Foundation, write to the Free Software Foundation; we sometimes\n" +
    "                                make exceptions for this.  Our decision will be guided by the two goals\n" +
    "                                of preserving the free status of all derivatives of our free software and\n" +
    "                                of promoting the sharing and reuse of software generally.\n" +
    "\n" +
    "                                                NO WARRANTY\n" +
    "\n" +
    "                                  11. BECAUSE THE PROGRAM IS LICENSED FREE OF CHARGE, THERE IS NO WARRANTY\n" +
    "                                FOR THE PROGRAM, TO THE EXTENT PERMITTED BY APPLICABLE LAW.  EXCEPT WHEN\n" +
    "                                OTHERWISE STATED IN WRITING THE COPYRIGHT HOLDERS AND/OR OTHER PARTIES\n" +
    "                                PROVIDE THE PROGRAM \"AS IS\" WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED\n" +
    "                                OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF\n" +
    "                                MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.  THE ENTIRE RISK AS\n" +
    "                                TO THE QUALITY AND PERFORMANCE OF THE PROGRAM IS WITH YOU.  SHOULD THE\n" +
    "                                PROGRAM PROVE DEFECTIVE, YOU ASSUME THE COST OF ALL NECESSARY SERVICING,\n" +
    "                                REPAIR OR CORRECTION.\n" +
    "\n" +
    "                                  12. IN NO EVENT UNLESS REQUIRED BY APPLICABLE LAW OR AGREED TO IN WRITING\n" +
    "                                WILL ANY COPYRIGHT HOLDER, OR ANY OTHER PARTY WHO MAY MODIFY AND/OR\n" +
    "                                REDISTRIBUTE THE PROGRAM AS PERMITTED ABOVE, BE LIABLE TO YOU FOR DAMAGES,\n" +
    "                                INCLUDING ANY GENERAL, SPECIAL, INCIDENTAL OR CONSEQUENTIAL DAMAGES ARISING\n" +
    "                                OUT OF THE USE OR INABILITY TO USE THE PROGRAM (INCLUDING BUT NOT LIMITED\n" +
    "                                TO LOSS OF DATA OR DATA BEING RENDERED INACCURATE OR LOSSES SUSTAINED BY\n" +
    "                                YOU OR THIRD PARTIES OR A FAILURE OF THE PROGRAM TO OPERATE WITH ANY OTHER\n" +
    "                                PROGRAMS), EVEN IF SUCH HOLDER OR OTHER PARTY HAS BEEN ADVISED OF THE\n" +
    "                                POSSIBILITY OF SUCH DAMAGES.\n" +
    "\n" +
    "                                             END OF TERMS AND CONDITIONS\n" +
    "\n" +
    "                                    Appendix: How to Apply These Terms to Your New Programs\n" +
    "\n" +
    "                                  If you develop a new program, and you want it to be of the greatest\n" +
    "                                possible use to the public, the best way to achieve this is to make it\n" +
    "                                free software which everyone can redistribute and change under these terms.\n" +
    "\n" +
    "                                  To do so, attach the following notices to the program.  It is safest\n" +
    "                                to attach them to the start of each source file to most effectively\n" +
    "                                convey the exclusion of warranty; and each file should have at least\n" +
    "                                the \"copyright\" line and a pointer to where the full notice is found.\n" +
    "\n" +
    "                                    &lt;one line to give the program's name and a brief idea of what it does.&gt;\n" +
    "                                    Copyright (C) 19yy  &lt;name of author&gt;\n" +
    "\n" +
    "                                    This program is free software; you can redistribute it and/or modify\n" +
    "                                    it under the terms of the GNU General Public License as published by\n" +
    "                                    the Free Software Foundation; either version 2 of the License, or\n" +
    "                                    (at your option) any later version.\n" +
    "\n" +
    "                                    This program is distributed in the hope that it will be useful,\n" +
    "                                    but WITHOUT ANY WARRANTY; without even the implied warranty of\n" +
    "                                    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\n" +
    "                                    GNU General Public License for more details.\n" +
    "\n" +
    "                                    You should have received a copy of the GNU General Public License\n" +
    "                                    along with this program; if not, write to the Free Software\n" +
    "                                    Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA\n" +
    "\n" +
    "                                Also add information on how to contact you by electronic and paper mail.\n" +
    "\n" +
    "                                If the program is interactive, make it output a short notice like this\n" +
    "                                when it starts in an interactive mode:\n" +
    "\n" +
    "                                    Gnomovision version 69, Copyright (C) 19yy name of author\n" +
    "                                    Gnomovision comes with ABSOLUTELY NO WARRANTY; for details type `show w'.\n" +
    "                                    This is free software, and you are welcome to redistribute it\n" +
    "                                    under certain conditions; type `show c' for details.\n" +
    "\n" +
    "                                The hypothetical commands `show w' and `show c' should show the appropriate\n" +
    "                                parts of the General Public License.  Of course, the commands you use may\n" +
    "                                be called something other than `show w' and `show c'; they could even be\n" +
    "                                mouse-clicks or menu items--whatever suits your program.\n" +
    "\n" +
    "                                You should also get your employer (if you work as a programmer) or your\n" +
    "                                school, if any, to sign a \"copyright disclaimer\" for the program, if\n" +
    "                                necessary.  Here is a sample; alter the names:\n" +
    "\n" +
    "                                  Yoyodyne, Inc., hereby disclaims all copyright interest in the program\n" +
    "                                  `Gnomovision' (which makes passes at compilers) written by James Hacker.\n" +
    "\n" +
    "                                  &lt;signature of Ty Coon&gt;, 1 April 1989\n" +
    "                                  Ty Coon, President of Vice\n" +
    "\n" +
    "                                This General Public License does not permit incorporating your program into\n" +
    "                                proprietary programs.  If your program is a subroutine library, you may\n" +
    "                                consider it more useful to permit linking proprietary applications with the\n" +
    "                                library.  If this is what you want to do, use the GNU Library General\n" +
    "                                Public License instead of this License.\n" +
    "\n" +
    "                                ======================================================================\n" +
    "                                COPYRIGHT AND PERMISSION NOTICE\n" +
    "\n" +
    "                                Copyright (c) 1996 - 2015, Daniel Stenberg, &lt;daniel@haxx.se&gt;\n" +
    "\n" +
    "                                All rights reserved.\n" +
    "\n" +
    "                                Permission to use, copy, modify, and distribute this software for any purpose\n" +
    "                                with or without fee is hereby granted, provided that the above copyright\n" +
    "                                notice and this permission notice appear in all copies.\n" +
    "\n" +
    "                                THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n" +
    "                                IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n" +
    "                                FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT OF THIRD PARTY RIGHTS. IN\n" +
    "                                NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,\n" +
    "                                DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR\n" +
    "                                OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE\n" +
    "                                OR OTHER DEALINGS IN THE SOFTWARE.\n" +
    "\n" +
    "                                Except as contained in this notice, the name of a copyright holder shall not\n" +
    "                                be used in advertising or otherwise to promote the sale, use or other dealings\n" +
    "                                in this Software without prior written authorization of the copyright holder.\n" +
    "\n" +
    "                                ======================================================================\n" +
    "                                Copyright (c) 1998, 1999, 2000 Thai Open Source Software Center Ltd\n" +
    "                                                               and Clark Cooper\n" +
    "                                Copyright (c) 2001, 2002, 2003, 2004, 2005, 2006 Expat maintainers.\n" +
    "\n" +
    "                                Permission is hereby granted, free of charge, to any person obtaining\n" +
    "                                a copy of this software and associated documentation files (the\n" +
    "                                \"Software\"), to deal in the Software without restriction, including\n" +
    "                                without limitation the rights to use, copy, modify, merge, publish,\n" +
    "                                distribute, sublicense, and/or sell copies of the Software, and to\n" +
    "                                permit persons to whom the Software is furnished to do so, subject to\n" +
    "                                the following conditions:\n" +
    "\n" +
    "                                The above copyright notice and this permission notice shall be included\n" +
    "                                in all copies or substantial portions of the Software.\n" +
    "\n" +
    "                                THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND,\n" +
    "                                EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF\n" +
    "                                MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.\n" +
    "                                IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY\n" +
    "                                CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,\n" +
    "                                TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE\n" +
    "                                SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n" +
    "\n" +
    "                                ======================================================================\n" +
    "                                This is the file \"copying.dj\".  It does NOT apply to any sources or\n" +
    "                                binaries copyrighted by UCB Berkeley, the Free Software Foundation, or\n" +
    "                                any other agency besides DJ Delorie and others who have agreed to\n" +
    "                                allow their sources to be distributed under these terms.\n" +
    "\n" +
    "                                   Copyright Information for sources and executables that are marked\n" +
    "                                   Copyright (C) DJ Delorie\n" +
    "                                                 7 Kim Lane\n" +
    "                                                 Rochester NH  03867-2954\n" +
    "\n" +
    "                                This document is Copyright (C) DJ Delorie and may be distributed\n" +
    "                                verbatim, but changing it is not allowed.\n" +
    "\n" +
    "                                Source code copyright DJ Delorie is distributed under the terms of the\n" +
    "                                GNU General Public Licence, with the following exceptions:\n" +
    "\n" +
    "                                * Sources used to build crt0.o, gcrt0.o, libc.a, libdbg.a, and\n" +
    "                                  libemu.a are distributed under the terms of the GNU Library General\n" +
    "                                  Public License, rather than the GNU GPL.\n" +
    "\n" +
    "                                * Any existing copyright or authorship information in any given source\n" +
    "                                  file must remain intact.  If you modify a source file, a notice to that\n" +
    "                                  effect must be added to the authorship information in the source file.\n" +
    "\n" +
    "                                * Runtime binaries, as provided by DJ in DJGPP, may be distributed\n" +
    "                                  without sources ONLY if the recipient is given sufficient information\n" +
    "                                  to obtain a copy of djgpp themselves.  This primarily applies to\n" +
    "                                  go32-v2.exe, emu387.dxe, and stubedit.exe.\n" +
    "\n" +
    "                                * Runtime objects and libraries, as provided by DJ in DJGPP, when\n" +
    "                                  linked into an application, may be distributed without sources ONLY\n" +
    "                                  if the recipient is given sufficient information to obtain a copy of\n" +
    "                                  djgpp themselves.  This primarily applies to crt0.o and libc.a.\n" +
    "\n" +
    "                                -----\n" +
    "\n" +
    "                                Changes to source code copyright BSD, FSF, or others, by DJ Delorie\n" +
    "                                fall under the terms of the original copyright.  Such files usually\n" +
    "                                have multiple copyright notices in them.\n" +
    "\n" +
    "                                A copy of the files \"COPYING\" and \"COPYING.LIB\" are included with this\n" +
    "                                document.  If you did not receive a copy of these files, you may\n" +
    "                                obtain one from whence this document was obtained, or by writing:\n" +
    "\n" +
    "                                      Free Software Foundation\n" +
    "                                      51 Franklin Street, Fifth Floor\n" +
    "                                      Boston, MA 02110-1301\n" +
    "                                      USA\n" +
    "\n" +
    "                                ======================================================================\n" +
    "                                The gettext-runtime package is partially under the LGPL and partially under\n" +
    "                                the GPL.\n" +
    "\n" +
    "                                The following parts are under the LGPL, see files intl/COPYING.LIB-2.0 and\n" +
    "                                intl/COPYING.LIB-2.1:\n" +
    "                                  - the libintl and libasprintf libraries and their header files,\n" +
    "                                  - the libintl.jar Java library,\n" +
    "                                  - the GNU.Gettext.dll C# library,\n" +
    "                                  - the gettext.sh shells script function library.\n" +
    "\n" +
    "                                The following parts are under the GPL, see file COPYING in the toplevel\n" +
    "                                directory:\n" +
    "                                  - the _programs_ gettext, ngettext, envsubst,\n" +
    "                                  - the documentation.\n" +
    "\n" +
    "                                ======================================================================\n" +
    "                                          GNU LIBRARY GENERAL PUBLIC LICENSE\n" +
    "                                               Version 2, June 1991\n" +
    "\n" +
    "                                 Copyright (C) 1991 Free Software Foundation, Inc.\n" +
    "                                 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA\n" +
    "                                 Everyone is permitted to copy and distribute verbatim copies\n" +
    "                                 of this license document, but changing it is not allowed.\n" +
    "\n" +
    "                                [This is the first released version of the library GPL.  It is\n" +
    "                                 numbered 2 because it goes with version 2 of the ordinary GPL.]\n" +
    "\n" +
    "                                                Preamble\n" +
    "\n" +
    "                                  The licenses for most software are designed to take away your\n" +
    "                                freedom to share and change it.  By contrast, the GNU General Public\n" +
    "                                Licenses are intended to guarantee your freedom to share and change\n" +
    "                                free software--to make sure the software is free for all its users.\n" +
    "\n" +
    "                                  This license, the Library General Public License, applies to some\n" +
    "                                specially designated Free Software Foundation software, and to any\n" +
    "                                other libraries whose authors decide to use it.  You can use it for\n" +
    "                                your libraries, too.\n" +
    "\n" +
    "                                  When we speak of free software, we are referring to freedom, not\n" +
    "                                price.  Our General Public Licenses are designed to make sure that you\n" +
    "                                have the freedom to distribute copies of free software (and charge for\n" +
    "                                this service if you wish), that you receive source code or can get it\n" +
    "                                if you want it, that you can change the software or use pieces of it\n" +
    "                                in new free programs; and that you know you can do these things.\n" +
    "\n" +
    "                                  To protect your rights, we need to make restrictions that forbid\n" +
    "                                anyone to deny you these rights or to ask you to surrender the rights.\n" +
    "                                These restrictions translate to certain responsibilities for you if\n" +
    "                                you distribute copies of the library, or if you modify it.\n" +
    "\n" +
    "                                  For example, if you distribute copies of the library, whether gratis\n" +
    "                                or for a fee, you must give the recipients all the rights that we gave\n" +
    "                                you.  You must make sure that they, too, receive or can get the source\n" +
    "                                code.  If you link a program with the library, you must provide\n" +
    "                                complete object files to the recipients so that they can relink them\n" +
    "                                with the library, after making changes to the library and recompiling\n" +
    "                                it.  And you must show them these terms so they know their rights.\n" +
    "\n" +
    "                                  Our method of protecting your rights has two steps: (1) copyright\n" +
    "                                the library, and (2) offer you this license which gives you legal\n" +
    "                                permission to copy, distribute and/or modify the library.\n" +
    "\n" +
    "                                  Also, for each distributor's protection, we want to make certain\n" +
    "                                that everyone understands that there is no warranty for this free\n" +
    "                                library.  If the library is modified by someone else and passed on, we\n" +
    "                                want its recipients to know that what they have is not the original\n" +
    "                                version, so that any problems introduced by others will not reflect on\n" +
    "                                the original authors' reputations.\n" +
    "\n" +
    "                                  Finally, any free program is threatened constantly by software\n" +
    "                                patents.  We wish to avoid the danger that companies distributing free\n" +
    "                                software will individually obtain patent licenses, thus in effect\n" +
    "                                transforming the program into proprietary software.  To prevent this,\n" +
    "                                we have made it clear that any patent must be licensed for everyone's\n" +
    "                                free use or not licensed at all.\n" +
    "\n" +
    "                                  Most GNU software, including some libraries, is covered by the ordinary\n" +
    "                                GNU General Public License, which was designed for utility programs.  This\n" +
    "                                license, the GNU Library General Public License, applies to certain\n" +
    "                                designated libraries.  This license is quite different from the ordinary\n" +
    "                                one; be sure to read it in full, and don't assume that anything in it is\n" +
    "                                the same as in the ordinary license.\n" +
    "\n" +
    "                                  The reason we have a separate public license for some libraries is that\n" +
    "                                they blur the distinction we usually make between modifying or adding to a\n" +
    "                                program and simply using it.  Linking a program with a library, without\n" +
    "                                changing the library, is in some sense simply using the library, and is\n" +
    "                                analogous to running a utility program or application program.  However, in\n" +
    "                                a textual and legal sense, the linked executable is a combined work, a\n" +
    "                                derivative of the original library, and the ordinary General Public License\n" +
    "                                treats it as such.\n" +
    "\n" +
    "                                  Because of this blurred distinction, using the ordinary General\n" +
    "                                Public License for libraries did not effectively promote software\n" +
    "                                sharing, because most developers did not use the libraries.  We\n" +
    "                                concluded that weaker conditions might promote sharing better.\n" +
    "\n" +
    "                                  However, unrestricted linking of non-free programs would deprive the\n" +
    "                                users of those programs of all benefit from the free status of the\n" +
    "                                libraries themselves.  This Library General Public License is intended to\n" +
    "                                permit developers of non-free programs to use free libraries, while\n" +
    "                                preserving your freedom as a user of such programs to change the free\n" +
    "                                libraries that are incorporated in them.  (We have not seen how to achieve\n" +
    "                                this as regards changes in header files, but we have achieved it as regards\n" +
    "                                changes in the actual functions of the Library.)  The hope is that this\n" +
    "                                will lead to faster development of free libraries.\n" +
    "\n" +
    "                                  The precise terms and conditions for copying, distribution and\n" +
    "                                modification follow.  Pay close attention to the difference between a\n" +
    "                                \"work based on the library\" and a \"work that uses the library\".  The\n" +
    "                                former contains code derived from the library, while the latter only\n" +
    "                                works together with the library.\n" +
    "\n" +
    "                                  Note that it is possible for a library to be covered by the ordinary\n" +
    "                                General Public License rather than by this special one.\n" +
    "\n" +
    "                                          GNU LIBRARY GENERAL PUBLIC LICENSE\n" +
    "                                   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION\n" +
    "\n" +
    "                                  0. This License Agreement applies to any software library which\n" +
    "                                contains a notice placed by the copyright holder or other authorized\n" +
    "                                party saying it may be distributed under the terms of this Library\n" +
    "                                General Public License (also called \"this License\").  Each licensee is\n" +
    "                                addressed as \"you\".\n" +
    "\n" +
    "                                  A \"library\" means a collection of software functions and/or data\n" +
    "                                prepared so as to be conveniently linked with application programs\n" +
    "                                (which use some of those functions and data) to form executables.\n" +
    "\n" +
    "                                  The \"Library\", below, refers to any such software library or work\n" +
    "                                which has been distributed under these terms.  A \"work based on the\n" +
    "                                Library\" means either the Library or any derivative work under\n" +
    "                                copyright law: that is to say, a work containing the Library or a\n" +
    "                                portion of it, either verbatim or with modifications and/or translated\n" +
    "                                straightforwardly into another language.  (Hereinafter, translation is\n" +
    "                                included without limitation in the term \"modification\".)\n" +
    "\n" +
    "                                  \"Source code\" for a work means the preferred form of the work for\n" +
    "                                making modifications to it.  For a library, complete source code means\n" +
    "                                all the source code for all modules it contains, plus any associated\n" +
    "                                interface definition files, plus the scripts used to control compilation\n" +
    "                                and installation of the library.\n" +
    "\n" +
    "                                  Activities other than copying, distribution and modification are not\n" +
    "                                covered by this License; they are outside its scope.  The act of\n" +
    "                                running a program using the Library is not restricted, and output from\n" +
    "                                such a program is covered only if its contents constitute a work based\n" +
    "                                on the Library (independent of the use of the Library in a tool for\n" +
    "                                writing it).  Whether that is true depends on what the Library does\n" +
    "                                and what the program that uses the Library does.\n" +
    "\n" +
    "                                  1. You may copy and distribute verbatim copies of the Library's\n" +
    "                                complete source code as you receive it, in any medium, provided that\n" +
    "                                you conspicuously and appropriately publish on each copy an\n" +
    "                                appropriate copyright notice and disclaimer of warranty; keep intact\n" +
    "                                all the notices that refer to this License and to the absence of any\n" +
    "                                warranty; and distribute a copy of this License along with the\n" +
    "                                Library.\n" +
    "\n" +
    "                                  You may charge a fee for the physical act of transferring a copy,\n" +
    "                                and you may at your option offer warranty protection in exchange for a\n" +
    "                                fee.\n" +
    "\n" +
    "                                  2. You may modify your copy or copies of the Library or any portion\n" +
    "                                of it, thus forming a work based on the Library, and copy and\n" +
    "                                distribute such modifications or work under the terms of Section 1\n" +
    "                                above, provided that you also meet all of these conditions:\n" +
    "\n" +
    "                                    a) The modified work must itself be a software library.\n" +
    "\n" +
    "                                    b) You must cause the files modified to carry prominent notices\n" +
    "                                    stating that you changed the files and the date of any change.\n" +
    "\n" +
    "                                    c) You must cause the whole of the work to be licensed at no\n" +
    "                                    charge to all third parties under the terms of this License.\n" +
    "\n" +
    "                                    d) If a facility in the modified Library refers to a function or a\n" +
    "                                    table of data to be supplied by an application program that uses\n" +
    "                                    the facility, other than as an argument passed when the facility\n" +
    "                                    is invoked, then you must make a good faith effort to ensure that,\n" +
    "                                    in the event an application does not supply such function or\n" +
    "                                    table, the facility still operates, and performs whatever part of\n" +
    "                                    its purpose remains meaningful.\n" +
    "\n" +
    "                                    (For example, a function in a library to compute square roots has\n" +
    "                                    a purpose that is entirely well-defined independent of the\n" +
    "                                    application.  Therefore, Subsection 2d requires that any\n" +
    "                                    application-supplied function or table used by this function must\n" +
    "                                    be optional: if the application does not supply it, the square\n" +
    "                                    root function must still compute square roots.)\n" +
    "\n" +
    "                                These requirements apply to the modified work as a whole.  If\n" +
    "                                identifiable sections of that work are not derived from the Library,\n" +
    "                                and can be reasonably considered independent and separate works in\n" +
    "                                themselves, then this License, and its terms, do not apply to those\n" +
    "                                sections when you distribute them as separate works.  But when you\n" +
    "                                distribute the same sections as part of a whole which is a work based\n" +
    "                                on the Library, the distribution of the whole must be on the terms of\n" +
    "                                this License, whose permissions for other licensees extend to the\n" +
    "                                entire whole, and thus to each and every part regardless of who wrote\n" +
    "                                it.\n" +
    "\n" +
    "                                Thus, it is not the intent of this section to claim rights or contest\n" +
    "                                your rights to work written entirely by you; rather, the intent is to\n" +
    "                                exercise the right to control the distribution of derivative or\n" +
    "                                collective works based on the Library.\n" +
    "\n" +
    "                                In addition, mere aggregation of another work not based on the Library\n" +
    "                                with the Library (or with a work based on the Library) on a volume of\n" +
    "                                a storage or distribution medium does not bring the other work under\n" +
    "                                the scope of this License.\n" +
    "\n" +
    "                                  3. You may opt to apply the terms of the ordinary GNU General Public\n" +
    "                                License instead of this License to a given copy of the Library.  To do\n" +
    "                                this, you must alter all the notices that refer to this License, so\n" +
    "                                that they refer to the ordinary GNU General Public License, version 2,\n" +
    "                                instead of to this License.  (If a newer version than version 2 of the\n" +
    "                                ordinary GNU General Public License has appeared, then you can specify\n" +
    "                                that version instead if you wish.)  Do not make any other change in\n" +
    "                                these notices.\n" +
    "\n" +
    "                                  Once this change is made in a given copy, it is irreversible for\n" +
    "                                that copy, so the ordinary GNU General Public License applies to all\n" +
    "                                subsequent copies and derivative works made from that copy.\n" +
    "\n" +
    "                                  This option is useful when you wish to copy part of the code of\n" +
    "                                the Library into a program that is not a library.\n" +
    "\n" +
    "                                  4. You may copy and distribute the Library (or a portion or\n" +
    "                                derivative of it, under Section 2) in object code or executable form\n" +
    "                                under the terms of Sections 1 and 2 above provided that you accompany\n" +
    "                                it with the complete corresponding machine-readable source code, which\n" +
    "                                must be distributed under the terms of Sections 1 and 2 above on a\n" +
    "                                medium customarily used for software interchange.\n" +
    "\n" +
    "                                  If distribution of object code is made by offering access to copy\n" +
    "                                from a designated place, then offering equivalent access to copy the\n" +
    "                                source code from the same place satisfies the requirement to\n" +
    "                                distribute the source code, even though third parties are not\n" +
    "                                compelled to copy the source along with the object code.\n" +
    "\n" +
    "                                  5. A program that contains no derivative of any portion of the\n" +
    "                                Library, but is designed to work with the Library by being compiled or\n" +
    "                                linked with it, is called a \"work that uses the Library\".  Such a\n" +
    "                                work, in isolation, is not a derivative work of the Library, and\n" +
    "                                therefore falls outside the scope of this License.\n" +
    "\n" +
    "                                  However, linking a \"work that uses the Library\" with the Library\n" +
    "                                creates an executable that is a derivative of the Library (because it\n" +
    "                                contains portions of the Library), rather than a \"work that uses the\n" +
    "                                library\".  The executable is therefore covered by this License.\n" +
    "                                Section 6 states terms for distribution of such executables.\n" +
    "\n" +
    "                                  When a \"work that uses the Library\" uses material from a header file\n" +
    "                                that is part of the Library, the object code for the work may be a\n" +
    "                                derivative work of the Library even though the source code is not.\n" +
    "                                Whether this is true is especially significant if the work can be\n" +
    "                                linked without the Library, or if the work is itself a library.  The\n" +
    "                                threshold for this to be true is not precisely defined by law.\n" +
    "\n" +
    "                                  If such an object file uses only numerical parameters, data\n" +
    "                                structure layouts and accessors, and small macros and small inline\n" +
    "                                functions (ten lines or less in length), then the use of the object\n" +
    "                                file is unrestricted, regardless of whether it is legally a derivative\n" +
    "                                work.  (Executables containing this object code plus portions of the\n" +
    "                                Library will still fall under Section 6.)\n" +
    "\n" +
    "                                  Otherwise, if the work is a derivative of the Library, you may\n" +
    "                                distribute the object code for the work under the terms of Section 6.\n" +
    "                                Any executables containing that work also fall under Section 6,\n" +
    "                                whether or not they are linked directly with the Library itself.\n" +
    "\n" +
    "                                  6. As an exception to the Sections above, you may also compile or\n" +
    "                                link a \"work that uses the Library\" with the Library to produce a\n" +
    "                                work containing portions of the Library, and distribute that work\n" +
    "                                under terms of your choice, provided that the terms permit\n" +
    "                                modification of the work for the customer's own use and reverse\n" +
    "                                engineering for debugging such modifications.\n" +
    "\n" +
    "                                  You must give prominent notice with each copy of the work that the\n" +
    "                                Library is used in it and that the Library and its use are covered by\n" +
    "                                this License.  You must supply a copy of this License.  If the work\n" +
    "                                during execution displays copyright notices, you must include the\n" +
    "                                copyright notice for the Library among them, as well as a reference\n" +
    "                                directing the user to the copy of this License.  Also, you must do one\n" +
    "                                of these things:\n" +
    "\n" +
    "                                    a) Accompany the work with the complete corresponding\n" +
    "                                    machine-readable source code for the Library including whatever\n" +
    "                                    changes were used in the work (which must be distributed under\n" +
    "                                    Sections 1 and 2 above); and, if the work is an executable linked\n" +
    "                                    with the Library, with the complete machine-readable \"work that\n" +
    "                                    uses the Library\", as object code and/or source code, so that the\n" +
    "                                    user can modify the Library and then relink to produce a modified\n" +
    "                                    executable containing the modified Library.  (It is understood\n" +
    "                                    that the user who changes the contents of definitions files in the\n" +
    "                                    Library will not necessarily be able to recompile the application\n" +
    "                                    to use the modified definitions.)\n" +
    "\n" +
    "                                    b) Accompany the work with a written offer, valid for at\n" +
    "                                    least three years, to give the same user the materials\n" +
    "                                    specified in Subsection 6a, above, for a charge no more\n" +
    "                                    than the cost of performing this distribution.\n" +
    "\n" +
    "                                    c) If distribution of the work is made by offering access to copy\n" +
    "                                    from a designated place, offer equivalent access to copy the above\n" +
    "                                    specified materials from the same place.\n" +
    "\n" +
    "                                    d) Verify that the user has already received a copy of these\n" +
    "                                    materials or that you have already sent this user a copy.\n" +
    "\n" +
    "                                  For an executable, the required form of the \"work that uses the\n" +
    "                                Library\" must include any data and utility programs needed for\n" +
    "                                reproducing the executable from it.  However, as a special exception,\n" +
    "                                the source code distributed need not include anything that is normally\n" +
    "                                distributed (in either source or binary form) with the major\n" +
    "                                components (compiler, kernel, and so on) of the operating system on\n" +
    "                                which the executable runs, unless that component itself accompanies\n" +
    "                                the executable.\n" +
    "\n" +
    "                                  It may happen that this requirement contradicts the license\n" +
    "                                restrictions of other proprietary libraries that do not normally\n" +
    "                                accompany the operating system.  Such a contradiction means you cannot\n" +
    "                                use both them and the Library together in an executable that you\n" +
    "                                distribute.\n" +
    "\n" +
    "                                  7. You may place library facilities that are a work based on the\n" +
    "                                Library side-by-side in a single library together with other library\n" +
    "                                facilities not covered by this License, and distribute such a combined\n" +
    "                                library, provided that the separate distribution of the work based on\n" +
    "                                the Library and of the other library facilities is otherwise\n" +
    "                                permitted, and provided that you do these two things:\n" +
    "\n" +
    "                                    a) Accompany the combined library with a copy of the same work\n" +
    "                                    based on the Library, uncombined with any other library\n" +
    "                                    facilities.  This must be distributed under the terms of the\n" +
    "                                    Sections above.\n" +
    "\n" +
    "                                    b) Give prominent notice with the combined library of the fact\n" +
    "                                    that part of it is a work based on the Library, and explaining\n" +
    "                                    where to find the accompanying uncombined form of the same work.\n" +
    "\n" +
    "                                  8. You may not copy, modify, sublicense, link with, or distribute\n" +
    "                                the Library except as expressly provided under this License.  Any\n" +
    "                                attempt otherwise to copy, modify, sublicense, link with, or\n" +
    "                                distribute the Library is void, and will automatically terminate your\n" +
    "                                rights under this License.  However, parties who have received copies,\n" +
    "                                or rights, from you under this License will not have their licenses\n" +
    "                                terminated so long as such parties remain in full compliance.\n" +
    "\n" +
    "                                  9. You are not required to accept this License, since you have not\n" +
    "                                signed it.  However, nothing else grants you permission to modify or\n" +
    "                                distribute the Library or its derivative works.  These actions are\n" +
    "                                prohibited by law if you do not accept this License.  Therefore, by\n" +
    "                                modifying or distributing the Library (or any work based on the\n" +
    "                                Library), you indicate your acceptance of this License to do so, and\n" +
    "                                all its terms and conditions for copying, distributing or modifying\n" +
    "                                the Library or works based on it.\n" +
    "\n" +
    "                                  10. Each time you redistribute the Library (or any work based on the\n" +
    "                                Library), the recipient automatically receives a license from the\n" +
    "                                original licensor to copy, distribute, link with or modify the Library\n" +
    "                                subject to these terms and conditions.  You may not impose any further\n" +
    "                                restrictions on the recipients' exercise of the rights granted herein.\n" +
    "                                You are not responsible for enforcing compliance by third parties to\n" +
    "                                this License.\n" +
    "\n" +
    "                                  11. If, as a consequence of a court judgment or allegation of patent\n" +
    "                                infringement or for any other reason (not limited to patent issues),\n" +
    "                                conditions are imposed on you (whether by court order, agreement or\n" +
    "                                otherwise) that contradict the conditions of this License, they do not\n" +
    "                                excuse you from the conditions of this License.  If you cannot\n" +
    "                                distribute so as to satisfy simultaneously your obligations under this\n" +
    "                                License and any other pertinent obligations, then as a consequence you\n" +
    "                                may not distribute the Library at all.  For example, if a patent\n" +
    "                                license would not permit royalty-free redistribution of the Library by\n" +
    "                                all those who receive copies directly or indirectly through you, then\n" +
    "                                the only way you could satisfy both it and this License would be to\n" +
    "                                refrain entirely from distribution of the Library.\n" +
    "\n" +
    "                                If any portion of this section is held invalid or unenforceable under any\n" +
    "                                particular circumstance, the balance of the section is intended to apply,\n" +
    "                                and the section as a whole is intended to apply in other circumstances.\n" +
    "\n" +
    "                                It is not the purpose of this section to induce you to infringe any\n" +
    "                                patents or other property right claims or to contest validity of any\n" +
    "                                such claims; this section has the sole purpose of protecting the\n" +
    "                                integrity of the free software distribution system which is\n" +
    "                                implemented by public license practices.  Many people have made\n" +
    "                                generous contributions to the wide range of software distributed\n" +
    "                                through that system in reliance on consistent application of that\n" +
    "                                system; it is up to the author/donor to decide if he or she is willing\n" +
    "                                to distribute software through any other system and a licensee cannot\n" +
    "                                impose that choice.\n" +
    "\n" +
    "                                This section is intended to make thoroughly clear what is believed to\n" +
    "                                be a consequence of the rest of this License.\n" +
    "\n" +
    "                                  12. If the distribution and/or use of the Library is restricted in\n" +
    "                                certain countries either by patents or by copyrighted interfaces, the\n" +
    "                                original copyright holder who places the Library under this License may add\n" +
    "                                an explicit geographical distribution limitation excluding those countries,\n" +
    "                                so that distribution is permitted only in or among countries not thus\n" +
    "                                excluded.  In such case, this License incorporates the limitation as if\n" +
    "                                written in the body of this License.\n" +
    "\n" +
    "                                  13. The Free Software Foundation may publish revised and/or new\n" +
    "                                versions of the Library General Public License from time to time.\n" +
    "                                Such new versions will be similar in spirit to the present version,\n" +
    "                                but may differ in detail to address new problems or concerns.\n" +
    "\n" +
    "                                Each version is given a distinguishing version number.  If the Library\n" +
    "                                specifies a version number of this License which applies to it and\n" +
    "                                \"any later version\", you have the option of following the terms and\n" +
    "                                conditions either of that version or of any later version published by\n" +
    "                                the Free Software Foundation.  If the Library does not specify a\n" +
    "                                license version number, you may choose any version ever published by\n" +
    "                                the Free Software Foundation.\n" +
    "\n" +
    "                                  14. If you wish to incorporate parts of the Library into other free\n" +
    "                                programs whose distribution conditions are incompatible with these,\n" +
    "                                write to the author to ask for permission.  For software which is\n" +
    "                                copyrighted by the Free Software Foundation, write to the Free\n" +
    "                                Software Foundation; we sometimes make exceptions for this.  Our\n" +
    "                                decision will be guided by the two goals of preserving the free status\n" +
    "                                of all derivatives of our free software and of promoting the sharing\n" +
    "                                and reuse of software generally.\n" +
    "\n" +
    "                                                NO WARRANTY\n" +
    "\n" +
    "                                  15. BECAUSE THE LIBRARY IS LICENSED FREE OF CHARGE, THERE IS NO\n" +
    "                                WARRANTY FOR THE LIBRARY, TO THE EXTENT PERMITTED BY APPLICABLE LAW.\n" +
    "                                EXCEPT WHEN OTHERWISE STATED IN WRITING THE COPYRIGHT HOLDERS AND/OR\n" +
    "                                OTHER PARTIES PROVIDE THE LIBRARY \"AS IS\" WITHOUT WARRANTY OF ANY\n" +
    "                                KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE\n" +
    "                                IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR\n" +
    "                                PURPOSE.  THE ENTIRE RISK AS TO THE QUALITY AND PERFORMANCE OF THE\n" +
    "                                LIBRARY IS WITH YOU.  SHOULD THE LIBRARY PROVE DEFECTIVE, YOU ASSUME\n" +
    "                                THE COST OF ALL NECESSARY SERVICING, REPAIR OR CORRECTION.\n" +
    "\n" +
    "                                  16. IN NO EVENT UNLESS REQUIRED BY APPLICABLE LAW OR AGREED TO IN\n" +
    "                                WRITING WILL ANY COPYRIGHT HOLDER, OR ANY OTHER PARTY WHO MAY MODIFY\n" +
    "                                AND/OR REDISTRIBUTE THE LIBRARY AS PERMITTED ABOVE, BE LIABLE TO YOU\n" +
    "                                FOR DAMAGES, INCLUDING ANY GENERAL, SPECIAL, INCIDENTAL OR\n" +
    "                                CONSEQUENTIAL DAMAGES ARISING OUT OF THE USE OR INABILITY TO USE THE\n" +
    "                                LIBRARY (INCLUDING BUT NOT LIMITED TO LOSS OF DATA OR DATA BEING\n" +
    "                                RENDERED INACCURATE OR LOSSES SUSTAINED BY YOU OR THIRD PARTIES OR A\n" +
    "                                FAILURE OF THE LIBRARY TO OPERATE WITH ANY OTHER SOFTWARE), EVEN IF\n" +
    "                                SUCH HOLDER OR OTHER PARTY HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH\n" +
    "                                DAMAGES.\n" +
    "\n" +
    "                                             END OF TERMS AND CONDITIONS\n" +
    "\n" +
    "                                     Appendix: How to Apply These Terms to Your New Libraries\n" +
    "\n" +
    "                                  If you develop a new library, and you want it to be of the greatest\n" +
    "                                possible use to the public, we recommend making it free software that\n" +
    "                                everyone can redistribute and change.  You can do so by permitting\n" +
    "                                redistribution under these terms (or, alternatively, under the terms of the\n" +
    "                                ordinary General Public License).\n" +
    "\n" +
    "                                  To apply these terms, attach the following notices to the library.  It is\n" +
    "                                safest to attach them to the start of each source file to most effectively\n" +
    "                                convey the exclusion of warranty; and each file should have at least the\n" +
    "                                \"copyright\" line and a pointer to where the full notice is found.\n" +
    "\n" +
    "                                    &lt;one line to give the library's name and a brief idea of what it does.&gt;\n" +
    "                                    Copyright (C) &lt;year&gt;  &lt;name of author&gt;\n" +
    "\n" +
    "                                    This library is free software; you can redistribute it and/or\n" +
    "                                    modify it under the terms of the GNU Library General Public\n" +
    "                                    License as published by the Free Software Foundation; either\n" +
    "                                    version 2 of the License, or (at your option) any later version.\n" +
    "\n" +
    "                                    This library is distributed in the hope that it will be useful,\n" +
    "                                    but WITHOUT ANY WARRANTY; without even the implied warranty of\n" +
    "                                    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU\n" +
    "                                    Library General Public License for more details.\n" +
    "\n" +
    "                                    You should have received a copy of the GNU Library General Public\n" +
    "                                    License along with this library; if not, write to the Free\n" +
    "                                    Software Foundation, Inc., 51 Franklin Street, Fifth Floor,\n" +
    "                                    Boston, MA 02110-1301, USA\n" +
    "\n" +
    "                                Also add information on how to contact you by electronic and paper mail.\n" +
    "\n" +
    "                                You should also get your employer (if you work as a programmer) or your\n" +
    "                                school, if any, to sign a \"copyright disclaimer\" for the library, if\n" +
    "                                necessary.  Here is a sample; alter the names:\n" +
    "\n" +
    "                                  Yoyodyne, Inc., hereby disclaims all copyright interest in the\n" +
    "                                  library `Frob' (a library for tweaking knobs) written by James Random Hacker.\n" +
    "\n" +
    "                                  &lt;signature of Ty Coon&gt;, 1 April 1990\n" +
    "                                  Ty Coon, President of Vice\n" +
    "\n" +
    "                                That's all there is to it!\n" +
    "                                ======================================================================\n" +
    "\n" +
    "                                # Copyright (c) 2004-2016 by Internet Systems Consortium, Inc. (\"ISC\")\n" +
    "                                # Copyright (c) 1995-2003 by Internet Software Consortium\n" +
    "                                #\n" +
    "                                # Permission to use, copy, modify, and distribute this software for any\n" +
    "                                # purpose with or without fee is hereby granted, provided that the above\n" +
    "                                # copyright notice and this permission notice appear in all copies.\n" +
    "                                #\n" +
    "                                # THE SOFTWARE IS PROVIDED \"AS IS\" AND ISC DISCLAIMS ALL WARRANTIES\n" +
    "                                # WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF\n" +
    "                                # MERCHANTABILITY AND FITNESS.  IN NO EVENT SHALL ISC BE LIABLE FOR\n" +
    "                                # ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES\n" +
    "                                # WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN\n" +
    "                                # ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT\n" +
    "                                # OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.\n" +
    "                                #\n" +
    "                                #   Internet Systems Consortium, Inc.\n" +
    "                                #   950 Charter Street\n" +
    "                                #   Redwood City, CA 94063\n" +
    "                                #   <info@isc.org>\n" +
    "                                #   https://www.isc.org/\n" +
    "\n" +
    "                                See the specific source files for any additional copyright or\n" +
    "                                license statements.\n" +
    "                                ======================================================================\n" +
    "\n" +
    "                                                  GNU LESSER GENERAL PUBLIC LICENSE\n" +
    "                                                       Version 2.1, February 1999\n" +
    "\n" +
    "                                 Copyright (C) 1991, 1999 Free Software Foundation, Inc.\n" +
    "                                     51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA\n" +
    "                                 Everyone is permitted to copy and distribute verbatim copies\n" +
    "                                 of this license document, but changing it is not allowed.\n" +
    "\n" +
    "                                [This is the first released version of the Lesser GPL.  It also counts\n" +
    "                                 as the successor of the GNU Library Public License, version 2, hence\n" +
    "                                 the version number 2.1.]\n" +
    "\n" +
    "                                                            Preamble\n" +
    "\n" +
    "                                  The licenses for most software are designed to take away your\n" +
    "                                freedom to share and change it.  By contrast, the GNU General Public\n" +
    "                                Licenses are intended to guarantee your freedom to share and change\n" +
    "                                free software--to make sure the software is free for all its users.\n" +
    "\n" +
    "                                  This license, the Lesser General Public License, applies to some\n" +
    "                                specially designated software packages--typically libraries--of the\n" +
    "                                Free Software Foundation and other authors who decide to use it.  You\n" +
    "                                can use it too, but we suggest you first think carefully about whether\n" +
    "                                this license or the ordinary General Public License is the better\n" +
    "                                strategy to use in any particular case, based on the explanations\n" +
    "                                below.\n" +
    "\n" +
    "                                  When we speak of free software, we are referring to freedom of use,\n" +
    "                                not price.  Our General Public Licenses are designed to make sure that\n" +
    "                                you have the freedom to distribute copies of free software (and charge\n" +
    "                                for this service if you wish); that you receive source code or can get\n" +
    "                                it if you want it; that you can change the software and use pieces of\n" +
    "                                it in new free programs; and that you are informed that you can do\n" +
    "                                these things.\n" +
    "\n" +
    "                                  To protect your rights, we need to make restrictions that forbid\n" +
    "                                distributors to deny you these rights or to ask you to surrender these\n" +
    "                                rights.  These restrictions translate to certain responsibilities for\n" +
    "                                you if you distribute copies of the library or if you modify it.\n" +
    "\n" +
    "                                  For example, if you distribute copies of the library, whether gratis\n" +
    "                                or for a fee, you must give the recipients all the rights that we gave\n" +
    "                                you.  You must make sure that they, too, receive or can get the source\n" +
    "                                code.  If you link other code with the library, you must provide\n" +
    "                                complete object files to the recipients, so that they can relink them\n" +
    "                                with the library after making changes to the library and recompiling\n" +
    "                                it.  And you must show them these terms so they know their rights.\n" +
    "\n" +
    "                                  We protect your rights with a two-step method: (1) we copyright the\n" +
    "                                library, and (2) we offer you this license, which gives you legal\n" +
    "                                permission to copy, distribute and/or modify the library.\n" +
    "\n" +
    "                                  To protect each distributor, we want to make it very clear that\n" +
    "                                there is no warranty for the free library.  Also, if the library is\n" +
    "                                modified by someone else and passed on, the recipients should know\n" +
    "                                that what they have is not the original version, so that the original\n" +
    "                                author's reputation will not be affected by problems that might be\n" +
    "                                introduced by others.\n" +
    "\n" +
    "                                  Finally, software patents pose a constant threat to the existence of\n" +
    "                                any free program.  We wish to make sure that a company cannot\n" +
    "                                effectively restrict the users of a free program by obtaining a\n" +
    "                                restrictive license from a patent holder.  Therefore, we insist that\n" +
    "                                any patent license obtained for a version of the library must be\n" +
    "                                consistent with the full freedom of use specified in this license.\n" +
    "\n" +
    "                                  Most GNU software, including some libraries, is covered by the\n" +
    "                                ordinary GNU General Public License.  This license, the GNU Lesser\n" +
    "                                General Public License, applies to certain designated libraries, and\n" +
    "                                is quite different from the ordinary General Public License.  We use\n" +
    "                                this license for certain libraries in order to permit linking those\n" +
    "                                libraries into non-free programs.\n" +
    "\n" +
    "                                  When a program is linked with a library, whether statically or using\n" +
    "                                a shared library, the combination of the two is legally speaking a\n" +
    "                                combined work, a derivative of the original library.  The ordinary\n" +
    "                                General Public License therefore permits such linking only if the\n" +
    "                                entire combination fits its criteria of freedom.  The Lesser General\n" +
    "                                Public License permits more lax criteria for linking other code with\n" +
    "                                the library.\n" +
    "\n" +
    "                                  We call this license the \"Lesser\" General Public License because it\n" +
    "                                does Less to protect the user's freedom than the ordinary General\n" +
    "                                Public License.  It also provides other free software developers Less\n" +
    "                                of an advantage over competing non-free programs.  These disadvantages\n" +
    "                                are the reason we use the ordinary General Public License for many\n" +
    "                                libraries.  However, the Lesser license provides advantages in certain\n" +
    "                                special circumstances.\n" +
    "\n" +
    "                                  For example, on rare occasions, there may be a special need to\n" +
    "                                encourage the widest possible use of a certain library, so that it\n" +
    "                                becomes\n" +
    "                                a de-facto standard.  To achieve this, non-free programs must be\n" +
    "                                allowed to use the library.  A more frequent case is that a free\n" +
    "                                library does the same job as widely used non-free libraries.  In this\n" +
    "                                case, there is little to gain by limiting the free library to free\n" +
    "                                software only, so we use the Lesser General Public License.\n" +
    "\n" +
    "                                  In other cases, permission to use a particular library in non-free\n" +
    "                                programs enables a greater number of people to use a large body of\n" +
    "                                free software.  For example, permission to use the GNU C Library in\n" +
    "                                non-free programs enables many more people to use the whole GNU\n" +
    "                                operating system, as well as its variant, the GNU/Linux operating\n" +
    "                                system.\n" +
    "\n" +
    "                                  Although the Lesser General Public License is Less protective of the\n" +
    "                                users' freedom, it does ensure that the user of a program that is\n" +
    "                                linked with the Library has the freedom and the wherewithal to run\n" +
    "                                that program using a modified version of the Library.\n" +
    "\n" +
    "                                  The precise terms and conditions for copying, distribution and\n" +
    "                                modification follow.  Pay close attention to the difference between a\n" +
    "                                \"work based on the library\" and a \"work that uses the library\".  The\n" +
    "                                former contains code derived from the library, whereas the latter must\n" +
    "                                be combined with the library in order to run.\n" +
    "\n" +
    "                                                  GNU LESSER GENERAL PUBLIC LICENSE\n" +
    "                                   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION\n" +
    "\n" +
    "                                  0. This License Agreement applies to any software library or other\n" +
    "                                program which contains a notice placed by the copyright holder or\n" +
    "                                other authorized party saying it may be distributed under the terms of\n" +
    "                                this Lesser General Public License (also called \"this License\").\n" +
    "                                Each licensee is addressed as \"you\".\n" +
    "\n" +
    "                                  A \"library\" means a collection of software functions and/or data\n" +
    "                                prepared so as to be conveniently linked with application programs\n" +
    "                                (which use some of those functions and data) to form executables.\n" +
    "\n" +
    "                                  The \"Library\", below, refers to any such software library or work\n" +
    "                                which has been distributed under these terms.  A \"work based on the\n" +
    "                                Library\" means either the Library or any derivative work under\n" +
    "                                copyright law: that is to say, a work containing the Library or a\n" +
    "                                portion of it, either verbatim or with modifications and/or translated\n" +
    "                                straightforwardly into another language.  (Hereinafter, translation is\n" +
    "                                included without limitation in the term \"modification\".)\n" +
    "\n" +
    "                                  \"Source code\" for a work means the preferred form of the work for\n" +
    "                                making modifications to it.  For a library, complete source code means\n" +
    "                                all the source code for all modules it contains, plus any associated\n" +
    "                                interface definition files, plus the scripts used to control\n" +
    "                                compilation\n" +
    "                                and installation of the library.\n" +
    "\n" +
    "                                  Activities other than copying, distribution and modification are not\n" +
    "                                covered by this License; they are outside its scope.  The act of\n" +
    "                                running a program using the Library is not restricted, and output from\n" +
    "                                such a program is covered only if its contents constitute a work based\n" +
    "                                on the Library (independent of the use of the Library in a tool for\n" +
    "                                writing it).  Whether that is true depends on what the Library does\n" +
    "                                and what the program that uses the Library does.\n" +
    "\n" +
    "                                  1. You may copy and distribute verbatim copies of the Library's\n" +
    "                                complete source code as you receive it, in any medium, provided that\n" +
    "                                you conspicuously and appropriately publish on each copy an\n" +
    "                                appropriate copyright notice and disclaimer of warranty; keep intact\n" +
    "                                all the notices that refer to this License and to the absence of any\n" +
    "                                warranty; and distribute a copy of this License along with the\n" +
    "                                Library.\n" +
    "\n" +
    "                                  You may charge a fee for the physical act of transferring a copy,\n" +
    "                                and you may at your option offer warranty protection in exchange for a\n" +
    "                                fee.\n" +
    "\n" +
    "                                  2. You may modify your copy or copies of the Library or any portion\n" +
    "                                of it, thus forming a work based on the Library, and copy and\n" +
    "                                distribute such modifications or work under the terms of Section 1\n" +
    "                                above, provided that you also meet all of these conditions:\n" +
    "\n" +
    "                                    a) The modified work must itself be a software library.\n" +
    "\n" +
    "                                    b) You must cause the files modified to carry prominent notices\n" +
    "                                    stating that you changed the files and the date of any change.\n" +
    "\n" +
    "                                    c) You must cause the whole of the work to be licensed at no\n" +
    "                                    charge to all third parties under the terms of this License.\n" +
    "\n" +
    "                                    d) If a facility in the modified Library refers to a function or a\n" +
    "                                    table of data to be supplied by an application program that uses\n" +
    "                                    the facility, other than as an argument passed when the facility\n" +
    "                                    is invoked, then you must make a good faith effort to ensure that,\n" +
    "                                    in the event an application does not supply such function or\n" +
    "                                    table, the facility still operates, and performs whatever part of\n" +
    "                                    its purpose remains meaningful.\n" +
    "\n" +
    "                                    (For example, a function in a library to compute square roots has\n" +
    "                                    a purpose that is entirely well-defined independent of the\n" +
    "                                    application.  Therefore, Subsection 2d requires that any\n" +
    "                                    application-supplied function or table used by this function must\n" +
    "                                    be optional: if the application does not supply it, the square\n" +
    "                                    root function must still compute square roots.)\n" +
    "\n" +
    "                                These requirements apply to the modified work as a whole.  If\n" +
    "                                identifiable sections of that work are not derived from the Library,\n" +
    "                                and can be reasonably considered independent and separate works in\n" +
    "                                themselves, then this License, and its terms, do not apply to those\n" +
    "                                sections when you distribute them as separate works.  But when you\n" +
    "                                distribute the same sections as part of a whole which is a work based\n" +
    "                                on the Library, the distribution of the whole must be on the terms of\n" +
    "                                this License, whose permissions for other licensees extend to the\n" +
    "                                entire whole, and thus to each and every part regardless of who wrote\n" +
    "                                it.\n" +
    "\n" +
    "                                Thus, it is not the intent of this section to claim rights or contest\n" +
    "                                your rights to work written entirely by you; rather, the intent is to\n" +
    "                                exercise the right to control the distribution of derivative or\n" +
    "                                collective works based on the Library.\n" +
    "\n" +
    "                                In addition, mere aggregation of another work not based on the Library\n" +
    "                                with the Library (or with a work based on the Library) on a volume of\n" +
    "                                a storage or distribution medium does not bring the other work under\n" +
    "                                the scope of this License.\n" +
    "\n" +
    "                                  3. You may opt to apply the terms of the ordinary GNU General Public\n" +
    "                                License instead of this License to a given copy of the Library.  To do\n" +
    "                                this, you must alter all the notices that refer to this License, so\n" +
    "                                that they refer to the ordinary GNU General Public License, version 2,\n" +
    "                                instead of to this License.  (If a newer version than version 2 of the\n" +
    "                                ordinary GNU General Public License has appeared, then you can specify\n" +
    "                                that version instead if you wish.)  Do not make any other change in\n" +
    "                                these notices.\n" +
    "\n" +
    "                                  Once this change is made in a given copy, it is irreversible for\n" +
    "                                that copy, so the ordinary GNU General Public License applies to all\n" +
    "                                subsequent copies and derivative works made from that copy.\n" +
    "\n" +
    "                                  This option is useful when you wish to copy part of the code of\n" +
    "                                the Library into a program that is not a library.\n" +
    "\n" +
    "                                  4. You may copy and distribute the Library (or a portion or\n" +
    "                                derivative of it, under Section 2) in object code or executable form\n" +
    "                                under the terms of Sections 1 and 2 above provided that you accompany\n" +
    "                                it with the complete corresponding machine-readable source code, which\n" +
    "                                must be distributed under the terms of Sections 1 and 2 above on a\n" +
    "                                medium customarily used for software interchange.\n" +
    "\n" +
    "                                  If distribution of object code is made by offering access to copy\n" +
    "                                from a designated place, then offering equivalent access to copy the\n" +
    "                                source code from the same place satisfies the requirement to\n" +
    "                                distribute the source code, even though third parties are not\n" +
    "                                compelled to copy the source along with the object code.\n" +
    "\n" +
    "                                  5. A program that contains no derivative of any portion of the\n" +
    "                                Library, but is designed to work with the Library by being compiled or\n" +
    "                                linked with it, is called a \"work that uses the Library\".  Such a\n" +
    "                                work, in isolation, is not a derivative work of the Library, and\n" +
    "                                therefore falls outside the scope of this License.\n" +
    "\n" +
    "                                  However, linking a \"work that uses the Library\" with the Library\n" +
    "                                creates an executable that is a derivative of the Library (because it\n" +
    "                                contains portions of the Library), rather than a \"work that uses the\n" +
    "                                library\".  The executable is therefore covered by this License.\n" +
    "                                Section 6 states terms for distribution of such executables.\n" +
    "\n" +
    "                                  When a \"work that uses the Library\" uses material from a header file\n" +
    "                                that is part of the Library, the object code for the work may be a\n" +
    "                                derivative work of the Library even though the source code is not.\n" +
    "                                Whether this is true is especially significant if the work can be\n" +
    "                                linked without the Library, or if the work is itself a library.  The\n" +
    "                                threshold for this to be true is not precisely defined by law.\n" +
    "\n" +
    "                                  If such an object file uses only numerical parameters, data\n" +
    "                                structure layouts and accessors, and small macros and small inline\n" +
    "                                functions (ten lines or less in length), then the use of the object\n" +
    "                                file is unrestricted, regardless of whether it is legally a derivative\n" +
    "                                work.  (Executables containing this object code plus portions of the\n" +
    "                                Library will still fall under Section 6.)\n" +
    "\n" +
    "                                  Otherwise, if the work is a derivative of the Library, you may\n" +
    "                                distribute the object code for the work under the terms of Section 6.\n" +
    "                                Any executables containing that work also fall under Section 6,\n" +
    "                                whether or not they are linked directly with the Library itself.\n" +
    "\n" +
    "                                  6. As an exception to the Sections above, you may also combine or\n" +
    "                                link a \"work that uses the Library\" with the Library to produce a\n" +
    "                                work containing portions of the Library, and distribute that work\n" +
    "                                under terms of your choice, provided that the terms permit\n" +
    "                                modification of the work for the customer's own use and reverse\n" +
    "                                engineering for debugging such modifications.\n" +
    "\n" +
    "                                  You must give prominent notice with each copy of the work that the\n" +
    "                                Library is used in it and that the Library and its use are covered by\n" +
    "                                this License.  You must supply a copy of this License.  If the work\n" +
    "                                during execution displays copyright notices, you must include the\n" +
    "                                copyright notice for the Library among them, as well as a reference\n" +
    "                                directing the user to the copy of this License.  Also, you must do one\n" +
    "                                of these things:\n" +
    "\n" +
    "                                    a) Accompany the work with the complete corresponding\n" +
    "                                    machine-readable source code for the Library including whatever\n" +
    "                                    changes were used in the work (which must be distributed under\n" +
    "                                    Sections 1 and 2 above); and, if the work is an executable linked\n" +
    "                                    with the Library, with the complete machine-readable \"work that\n" +
    "                                    uses the Library\", as object code and/or source code, so that the\n" +
    "                                    user can modify the Library and then relink to produce a modified\n" +
    "                                    executable containing the modified Library.  (It is understood\n" +
    "                                    that the user who changes the contents of definitions files in the\n" +
    "                                    Library will not necessarily be able to recompile the application\n" +
    "                                    to use the modified definitions.)\n" +
    "\n" +
    "                                    b) Use a suitable shared library mechanism for linking with the\n" +
    "                                    Library.  A suitable mechanism is one that (1) uses at run time a\n" +
    "                                    copy of the library already present on the user's computer system,\n" +
    "                                    rather than copying library functions into the executable, and (2)\n" +
    "                                    will operate properly with a modified version of the library, if\n" +
    "                                    the user installs one, as long as the modified version is\n" +
    "                                    interface-compatible with the version that the work was made with.\n" +
    "\n" +
    "                                    c) Accompany the work with a written offer, valid for at\n" +
    "                                    least three years, to give the same user the materials\n" +
    "                                    specified in Subsection 6a, above, for a charge no more\n" +
    "                                    than the cost of performing this distribution.\n" +
    "\n" +
    "                                    d) If distribution of the work is made by offering access to copy\n" +
    "                                    from a designated place, offer equivalent access to copy the above\n" +
    "                                    specified materials from the same place.\n" +
    "\n" +
    "                                    e) Verify that the user has already received a copy of these\n" +
    "                                    materials or that you have already sent this user a copy.\n" +
    "\n" +
    "                                  For an executable, the required form of the \"work that uses the\n" +
    "                                Library\" must include any data and utility programs needed for\n" +
    "                                reproducing the executable from it.  However, as a special exception,\n" +
    "                                the materials to be distributed need not include anything that is\n" +
    "                                normally distributed (in either source or binary form) with the major\n" +
    "                                components (compiler, kernel, and so on) of the operating system on\n" +
    "                                which the executable runs, unless that component itself accompanies\n" +
    "                                the executable.\n" +
    "\n" +
    "                                  It may happen that this requirement contradicts the license\n" +
    "                                restrictions of other proprietary libraries that do not normally\n" +
    "                                accompany the operating system.  Such a contradiction means you cannot\n" +
    "                                use both them and the Library together in an executable that you\n" +
    "                                distribute.\n" +
    "\n" +
    "                                  7. You may place library facilities that are a work based on the\n" +
    "                                Library side-by-side in a single library together with other library\n" +
    "                                facilities not covered by this License, and distribute such a combined\n" +
    "                                library, provided that the separate distribution of the work based on\n" +
    "                                the Library and of the other library facilities is otherwise\n" +
    "                                permitted, and provided that you do these two things:\n" +
    "\n" +
    "                                    a) Accompany the combined library with a copy of the same work\n" +
    "                                    based on the Library, uncombined with any other library\n" +
    "                                    facilities.  This must be distributed under the terms of the\n" +
    "                                    Sections above.\n" +
    "\n" +
    "                                    b) Give prominent notice with the combined library of the fact\n" +
    "                                    that part of it is a work based on the Library, and explaining\n" +
    "                                    where to find the accompanying uncombined form of the same work.\n" +
    "\n" +
    "                                  8. You may not copy, modify, sublicense, link with, or distribute\n" +
    "                                the Library except as expressly provided under this License.  Any\n" +
    "                                attempt otherwise to copy, modify, sublicense, link with, or\n" +
    "                                distribute the Library is void, and will automatically terminate your\n" +
    "                                rights under this License.  However, parties who have received copies,\n" +
    "                                or rights, from you under this License will not have their licenses\n" +
    "                                terminated so long as such parties remain in full compliance.\n" +
    "\n" +
    "                                  9. You are not required to accept this License, since you have not\n" +
    "                                signed it.  However, nothing else grants you permission to modify or\n" +
    "                                distribute the Library or its derivative works.  These actions are\n" +
    "                                prohibited by law if you do not accept this License.  Therefore, by\n" +
    "                                modifying or distributing the Library (or any work based on the\n" +
    "                                Library), you indicate your acceptance of this License to do so, and\n" +
    "                                all its terms and conditions for copying, distributing or modifying\n" +
    "                                the Library or works based on it.\n" +
    "\n" +
    "                                  10. Each time you redistribute the Library (or any work based on the\n" +
    "                                Library), the recipient automatically receives a license from the\n" +
    "                                original licensor to copy, distribute, link with or modify the Library\n" +
    "                                subject to these terms and conditions.  You may not impose any further\n" +
    "                                restrictions on the recipients' exercise of the rights granted herein.\n" +
    "                                You are not responsible for enforcing compliance by third parties with\n" +
    "                                this License.\n" +
    "\n" +
    "                                  11. If, as a consequence of a court judgment or allegation of patent\n" +
    "                                infringement or for any other reason (not limited to patent issues),\n" +
    "                                conditions are imposed on you (whether by court order, agreement or\n" +
    "                                otherwise) that contradict the conditions of this License, they do not\n" +
    "                                excuse you from the conditions of this License.  If you cannot\n" +
    "                                distribute so as to satisfy simultaneously your obligations under this\n" +
    "                                License and any other pertinent obligations, then as a consequence you\n" +
    "                                may not distribute the Library at all.  For example, if a patent\n" +
    "                                license would not permit royalty-free redistribution of the Library by\n" +
    "                                all those who receive copies directly or indirectly through you, then\n" +
    "                                the only way you could satisfy both it and this License would be to\n" +
    "                                refrain entirely from distribution of the Library.\n" +
    "\n" +
    "                                If any portion of this section is held invalid or unenforceable under\n" +
    "                                any particular circumstance, the balance of the section is intended to\n" +
    "                                apply, and the section as a whole is intended to apply in other\n" +
    "                                circumstances.\n" +
    "\n" +
    "                                It is not the purpose of this section to induce you to infringe any\n" +
    "                                patents or other property right claims or to contest validity of any\n" +
    "                                such claims; this section has the sole purpose of protecting the\n" +
    "                                integrity of the free software distribution system which is\n" +
    "                                implemented by public license practices.  Many people have made\n" +
    "                                generous contributions to the wide range of software distributed\n" +
    "                                through that system in reliance on consistent application of that\n" +
    "                                system; it is up to the author/donor to decide if he or she is willing\n" +
    "                                to distribute software through any other system and a licensee cannot\n" +
    "                                impose that choice.\n" +
    "\n" +
    "                                This section is intended to make thoroughly clear what is believed to\n" +
    "                                be a consequence of the rest of this License.\n" +
    "\n" +
    "                                  12. If the distribution and/or use of the Library is restricted in\n" +
    "                                certain countries either by patents or by copyrighted interfaces, the\n" +
    "                                original copyright holder who places the Library under this License\n" +
    "                                may add an explicit geographical distribution limitation excluding those\n" +
    "                                countries, so that distribution is permitted only in or among\n" +
    "                                countries not thus excluded.  In such case, this License incorporates\n" +
    "                                the limitation as if written in the body of this License.\n" +
    "\n" +
    "                                  13. The Free Software Foundation may publish revised and/or new\n" +
    "                                versions of the Lesser General Public License from time to time.\n" +
    "                                Such new versions will be similar in spirit to the present version,\n" +
    "                                but may differ in detail to address new problems or concerns.\n" +
    "\n" +
    "                                Each version is given a distinguishing version number.  If the Library\n" +
    "                                specifies a version number of this License which applies to it and\n" +
    "                                \"any later version\", you have the option of following the terms and\n" +
    "                                conditions either of that version or of any later version published by\n" +
    "                                the Free Software Foundation.  If the Library does not specify a\n" +
    "                                license version number, you may choose any version ever published by\n" +
    "                                the Free Software Foundation.\n" +
    "\n" +
    "                                  14. If you wish to incorporate parts of the Library into other free\n" +
    "                                programs whose distribution conditions are incompatible with these,\n" +
    "                                write to the author to ask for permission.  For software which is\n" +
    "                                copyrighted by the Free Software Foundation, write to the Free\n" +
    "                                Software Foundation; we sometimes make exceptions for this.  Our\n" +
    "                                decision will be guided by the two goals of preserving the free status\n" +
    "                                of all derivatives of our free software and of promoting the sharing\n" +
    "                                and reuse of software generally.\n" +
    "\n" +
    "                                                            NO WARRANTY\n" +
    "\n" +
    "                                  15. BECAUSE THE LIBRARY IS LICENSED FREE OF CHARGE, THERE IS NO\n" +
    "                                WARRANTY FOR THE LIBRARY, TO THE EXTENT PERMITTED BY APPLICABLE LAW.\n" +
    "                                EXCEPT WHEN OTHERWISE STATED IN WRITING THE COPYRIGHT HOLDERS AND/OR\n" +
    "                                OTHER PARTIES PROVIDE THE LIBRARY \"AS IS\" WITHOUT WARRANTY OF ANY\n" +
    "                                KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE\n" +
    "                                IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR\n" +
    "                                PURPOSE.  THE ENTIRE RISK AS TO THE QUALITY AND PERFORMANCE OF THE\n" +
    "                                LIBRARY IS WITH YOU.  SHOULD THE LIBRARY PROVE DEFECTIVE, YOU ASSUME\n" +
    "                                THE COST OF ALL NECESSARY SERVICING, REPAIR OR CORRECTION.\n" +
    "\n" +
    "                                  16. IN NO EVENT UNLESS REQUIRED BY APPLICABLE LAW OR AGREED TO IN\n" +
    "                                WRITING WILL ANY COPYRIGHT HOLDER, OR ANY OTHER PARTY WHO MAY MODIFY\n" +
    "                                AND/OR REDISTRIBUTE THE LIBRARY AS PERMITTED ABOVE, BE LIABLE TO YOU\n" +
    "                                FOR DAMAGES, INCLUDING ANY GENERAL, SPECIAL, INCIDENTAL OR\n" +
    "                                CONSEQUENTIAL DAMAGES ARISING OUT OF THE USE OR INABILITY TO USE THE\n" +
    "                                LIBRARY (INCLUDING BUT NOT LIMITED TO LOSS OF DATA OR DATA BEING\n" +
    "                                RENDERED INACCURATE OR LOSSES SUSTAINED BY YOU OR THIRD PARTIES OR A\n" +
    "                                FAILURE OF THE LIBRARY TO OPERATE WITH ANY OTHER SOFTWARE), EVEN IF\n" +
    "                                SUCH HOLDER OR OTHER PARTY HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH\n" +
    "                                DAMAGES.\n" +
    "\n" +
    "                                                     END OF TERMS AND CONDITIONS\n" +
    "\n" +
    "                                           How to Apply These Terms to Your New Libraries\n" +
    "\n" +
    "                                  If you develop a new library, and you want it to be of the greatest\n" +
    "                                possible use to the public, we recommend making it free software that\n" +
    "                                everyone can redistribute and change.  You can do so by permitting\n" +
    "                                redistribution under these terms (or, alternatively, under the terms\n" +
    "                                of the ordinary General Public License).\n" +
    "\n" +
    "                                  To apply these terms, attach the following notices to the library.\n" +
    "                                It is safest to attach them to the start of each source file to most\n" +
    "                                effectively convey the exclusion of warranty; and each file should\n" +
    "                                have at least the \"copyright\" line and a pointer to where the full\n" +
    "                                notice is found.\n" +
    "\n" +
    "\n" +
    "                                    &lt;one line to give the library's name and a brief idea of what it\n" +
    "                                does.&gt;\n" +
    "                                    Copyright (C) &lt;year&gt;  &lt;name of author&gt;\n" +
    "\n" +
    "                                    This library is free software; you can redistribute it and/or\n" +
    "                                    modify it under the terms of the GNU Lesser General Public\n" +
    "                                    License as published by the Free Software Foundation; either\n" +
    "                                    version 2 of the License, or (at your option) any later version.\n" +
    "\n" +
    "                                    This library is distributed in the hope that it will be useful,\n" +
    "                                    but WITHOUT ANY WARRANTY; without even the implied warranty of\n" +
    "                                    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU\n" +
    "                                    Lesser General Public License for more details.\n" +
    "\n" +
    "                                    You should have received a copy of the GNU Lesser General Public\n" +
    "                                    License along with this library; if not, write to the Free Software\n" +
    "                                    Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,\n" +
    "                                    MA 02110-1301, USA\n" +
    "\n" +
    "                                Also add information on how to contact you by electronic and paper\n" +
    "                                mail.\n" +
    "\n" +
    "                                You should also get your employer (if you work as a programmer) or\n" +
    "                                your\n" +
    "                                school, if any, to sign a \"copyright disclaimer\" for the library, if\n" +
    "                                necessary.  Here is a sample; alter the names:\n" +
    "\n" +
    "                                  Yoyodyne, Inc., hereby disclaims all copyright interest in the\n" +
    "                                  library `Frob' (a library for tweaking knobs) written by James\n" +
    "                                Random Hacker.\n" +
    "\n" +
    "                                  &lt;signature of Ty Coon&gt;, 1 April 1990\n" +
    "                                  Ty Coon, President of Vice\n" +
    "\n" +
    "                                That's all there is to it!\n" +
    "\n" +
    "                                ======================================================================\n" +
    "\n" +
    "                                This copy of the libpng notices is provided for your convenience.  In case of\n" +
    "                                any discrepancy between this copy and the notices in the file png.h that is\n" +
    "                                included in the libpng distribution, the latter shall prevail.\n" +
    "\n" +
    "                                COPYRIGHT NOTICE, DISCLAIMER, and LICENSE:\n" +
    "\n" +
    "                                If you modify libpng you may insert additional notices immediately following\n" +
    "                                this sentence.\n" +
    "\n" +
    "                                This code is released under the libpng license.\n" +
    "\n" +
    "                                libpng versions 1.2.6, August 15, 2004, through 1.2.49, March 29, 2012, are\n" +
    "                                Copyright (c) 2004, 2006-2009 Glenn Randers-Pehrson, and are\n" +
    "                                distributed according to the same disclaimer and license as libpng-1.2.5\n" +
    "                                with the following individual added to the list of Contributing Authors\n" +
    "\n" +
    "                                   Cosmin Truta\n" +
    "\n" +
    "                                libpng versions 1.0.7, July 1, 2000, through 1.2.5 - October 3, 2002, are\n" +
    "                                Copyright (c) 2000-2002 Glenn Randers-Pehrson, and are\n" +
    "                                distributed according to the same disclaimer and license as libpng-1.0.6\n" +
    "                                with the following individuals added to the list of Contributing Authors\n" +
    "\n" +
    "                                   Simon-Pierre Cadieux\n" +
    "                                   Eric S. Raymond\n" +
    "                                   Gilles Vollant\n" +
    "\n" +
    "                                and with the following additions to the disclaimer:\n" +
    "\n" +
    "                                   There is no warranty against interference with your enjoyment of the\n" +
    "                                   library or against infringement.  There is no warranty that our\n" +
    "                                   efforts or the library will fulfill any of your particular purposes\n" +
    "                                   or needs.  This library is provided with all faults, and the entire\n" +
    "                                   risk of satisfactory quality, performance, accuracy, and effort is with\n" +
    "                                   the user.\n" +
    "\n" +
    "                                libpng versions 0.97, January 1998, through 1.0.6, March 20, 2000, are\n" +
    "                                Copyright (c) 1998, 1999 Glenn Randers-Pehrson, and are\n" +
    "                                distributed according to the same disclaimer and license as libpng-0.96,\n" +
    "                                with the following individuals added to the list of Contributing Authors:\n" +
    "\n" +
    "                                   Tom Lane\n" +
    "                                   Glenn Randers-Pehrson\n" +
    "                                   Willem van Schaik\n" +
    "\n" +
    "                                libpng versions 0.89, June 1996, through 0.96, May 1997, are\n" +
    "                                Copyright (c) 1996, 1997 Andreas Dilger\n" +
    "                                Distributed according to the same disclaimer and license as libpng-0.88,\n" +
    "                                with the following individuals added to the list of Contributing Authors:\n" +
    "\n" +
    "                                   John Bowler\n" +
    "                                   Kevin Bracey\n" +
    "                                   Sam Bushell\n" +
    "                                   Magnus Holmgren\n" +
    "                                   Greg Roelofs\n" +
    "                                   Tom Tanner\n" +
    "\n" +
    "                                libpng versions 0.5, May 1995, through 0.88, January 1996, are\n" +
    "                                Copyright (c) 1995, 1996 Guy Eric Schalnat, Group 42, Inc.\n" +
    "\n" +
    "                                For the purposes of this copyright and license, \"Contributing Authors\"\n" +
    "                                is defined as the following set of individuals:\n" +
    "\n" +
    "                                   Andreas Dilger\n" +
    "                                   Dave Martindale\n" +
    "                                   Guy Eric Schalnat\n" +
    "                                   Paul Schmidt\n" +
    "                                   Tim Wegner\n" +
    "\n" +
    "                                The PNG Reference Library is supplied \"AS IS\".  The Contributing Authors\n" +
    "                                and Group 42, Inc. disclaim all warranties, expressed or implied,\n" +
    "                                including, without limitation, the warranties of merchantability and of\n" +
    "                                fitness for any purpose.  The Contributing Authors and Group 42, Inc.\n" +
    "                                assume no liability for direct, indirect, incidental, special, exemplary,\n" +
    "                                or consequential damages, which may result from the use of the PNG\n" +
    "                                Reference Library, even if advised of the possibility of such damage.\n" +
    "\n" +
    "                                Permission is hereby granted to use, copy, modify, and distribute this\n" +
    "                                source code, or portions hereof, for any purpose, without fee, subject\n" +
    "                                to the following restrictions:\n" +
    "\n" +
    "                                1. The origin of this source code must not be misrepresented.\n" +
    "\n" +
    "                                2. Altered versions must be plainly marked as such and must not\n" +
    "                                   be misrepresented as being the original source.\n" +
    "\n" +
    "                                3. This Copyright notice may not be removed or altered from any\n" +
    "                                   source or altered source distribution.\n" +
    "\n" +
    "                                The Contributing Authors and Group 42, Inc. specifically permit, without\n" +
    "                                fee, and encourage the use of this source code as a component to\n" +
    "                                supporting the PNG file format in commercial products.  If you use this\n" +
    "                                source code in a product, acknowledgment is not required but would be\n" +
    "                                appreciated.\n" +
    "\n" +
    "\n" +
    "                                A \"png_get_copyright\" function is available, for convenient use in \"about\"\n" +
    "                                boxes and the like:\n" +
    "\n" +
    "                                   printf(\"%s\",png_get_copyright(NULL));\n" +
    "\n" +
    "                                Also, the PNG logo (in PNG format, of course) is supplied in the\n" +
    "                                files \"pngbar.png\" and \"pngbar.jpg (88x31) and \"pngnow.png\" (98x31).\n" +
    "\n" +
    "                                Libpng is OSI Certified Open Source Software.  OSI Certified Open Source is a\n" +
    "                                certification mark of the Open Source Initiative.\n" +
    "\n" +
    "                                Glenn Randers-Pehrson\n" +
    "                                glennrp at users.sourceforge.net\n" +
    "                                March 29, 2012\n" +
    "                                ======================================================================\n" +
    "\n" +
    "                                MIT License\n" +
    "\n" +
    "                                Copyright (c) <year> <copyright holders>\n" +
    "\n" +
    "                                Permission is hereby granted, free of charge, to any person obtaining a copy\n" +
    "                                of this software and associated documentation files (the \"Software\"), to deal\n" +
    "                                in the Software without restriction, including without limitation the rights\n" +
    "                                to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n" +
    "                                copies of the Software, and to permit persons to whom the Software is\n" +
    "                                furnished to do so, subject to the following conditions:\n" +
    "\n" +
    "                                The above copyright notice and this permission notice shall be included in\n" +
    "                                all copies or substantial portions of the Software.\n" +
    "\n" +
    "                                THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n" +
    "                                IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n" +
    "                                FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n" +
    "                                AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n" +
    "                                LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n" +
    "                                OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n" +
    "                                THE SOFTWARE.\n" +
    "                                ======================================================================\n" +
    "\n" +
    "                                Mozilla Public License Version 2.0\n" +
    "                                ==================================\n" +
    "\n" +
    "                                1. Definitions\n" +
    "                                --------------\n" +
    "\n" +
    "                                1.1. \"Contributor\"\n" +
    "                                    means each individual or legal entity that creates, contributes to\n" +
    "                                    the creation of, or owns Covered Software.\n" +
    "\n" +
    "                                1.2. \"Contributor Version\"\n" +
    "                                    means the combination of the Contributions of others (if any) used\n" +
    "                                    by a Contributor and that particular Contributor's Contribution.\n" +
    "\n" +
    "                                1.3. \"Contribution\"\n" +
    "                                    means Covered Software of a particular Contributor.\n" +
    "\n" +
    "                                1.4. \"Covered Software\"\n" +
    "                                    means Source Code Form to which the initial Contributor has attached\n" +
    "                                    the notice in Exhibit A, the Executable Form of such Source Code\n" +
    "                                    Form, and Modifications of such Source Code Form, in each case\n" +
    "                                    including portions thereof.\n" +
    "\n" +
    "                                1.5. \"Incompatible With Secondary Licenses\"\n" +
    "                                    means\n" +
    "\n" +
    "                                    (a) that the initial Contributor has attached the notice described\n" +
    "                                        in Exhibit B to the Covered Software; or\n" +
    "\n" +
    "                                    (b) that the Covered Software was made available under the terms of\n" +
    "                                        version 1.1 or earlier of the License, but not also under the\n" +
    "                                        terms of a Secondary License.\n" +
    "\n" +
    "                                1.6. \"Executable Form\"\n" +
    "                                    means any form of the work other than Source Code Form.\n" +
    "\n" +
    "                                1.7. \"Larger Work\"\n" +
    "                                    means a work that combines Covered Software with other material, in\n" + 
    "                                    a separate file or files, that is not Covered Software.\n" +
    "\n" +
    "                                1.8. \"License\"\n" +
    "                                    means this document.\n" +
    "\n" +                                
    "                                1.9. \"Licensable\"\n" +
    "                                    means having the right to grant, to the maximum extent possible,\n" +
    "                                    whether at the time of the initial grant or subsequently, any and\n" +
    "                                    all of the rights conveyed by this License.\n" +
    "\n" +
    "                                1.10. \"Modifications\"\n" +
    "                                    means any of the following:\n" +
    "\n" +
    "                                    (a) any file in Source Code Form that results from an addition to,\n" +
    "                                        deletion from, or modification of the contents of Covered\n" +
    "                                        Software; or\n" +
    "\n" +
    "                                    (b) any new file in Source Code Form that contains any Covered\n" +
    "                                        Software.\n" +
    "\n" +
    "                                1.11. \"Patent Claims\" of a Contributor\n" +
    "                                    means any patent claim(s), including without limitation, method,\n" +
    "                                    process, and apparatus claims, in any patent Licensable by such\n" +
    "                                    Contributor that would be infringed, but for the grant of the\n" +
    "                                    License, by the making, using, selling, offering for sale, having\n" +
    "                                    made, import, or transfer of either its Contributions or its\n" +
    "                                    Contributor Version.\n" +
    "\n" +
    "                                1.12. \"Secondary License\"\n" +
    "                                    means either the GNU General Public License, Version 2.0, the GNU\n" +
    "                                    Lesser General Public License, Version 2.1, the GNU Affero General\n" +
    "                                    Public License, Version 3.0, or any later versions of those\n" +
    "                                    licenses.\n" +
    "\n" +
    "                                1.13. \"Source Code Form\"\n" +
    "                                    means the form of the work preferred for making modifications.\n" +
    "\n" +
    "                                1.14. \"You\" (or \"Your\")\n" +
    "                                    means an individual or a legal entity exercising rights under this\n" +
    "                                    License. For legal entities, \"You\" includes any entity that\n" +
    "                                    controls, is controlled by, or is under common control with You. For\n" +
    "                                    purposes of this definition, \"control\" means (a) the power, direct\n" +
    "                                    or indirect, to cause the direction or management of such entity,\n" +
    "                                    whether by contract or otherwise, or (b) ownership of more than\n" +
    "                                    fifty percent (50%) of the outstanding shares or beneficial\n" +
    "                                    ownership of such entity.\n" +
    "\n" +
    "                                2. License Grants and Conditions\n" +
    "                                --------------------------------\n" +
    "\n" +
    "                                2.1. Grants\n" +
    "\n" +
    "                                Each Contributor hereby grants You a world-wide, royalty-free,\n" +
    "                                non-exclusive license:\n" +
    "\n" +
    "                                (a) under intellectual property rights (other than patent or trademark)\n" +
    "                                    Licensable by such Contributor to use, reproduce, make available,\n" +
    "                                    modify, display, perform, distribute, and otherwise exploit its\n" +
    "                                    Contributions, either on an unmodified basis, with Modifications, or\n" +
    "                                    as part of a Larger Work; and\n" +
    "\n" +
    "                                (b) under Patent Claims of such Contributor to make, use, sell, offer\n" +
    "                                    for sale, have made, import, and otherwise transfer either its\n" +
    "                                    Contributions or its Contributor Version.\n" +
    "\n" +
    "                                2.2. Effective Date\n" +
    "\n" +
    "                                The licenses granted in Section 2.1 with respect to any Contribution\n" +
    "                                become effective for each Contribution on the date the Contributor first\n" +
    "                                distributes such Contribution.\n" +
    "\n" +
    "                                2.3. Limitations on Grant Scope\n" +
    "\n" +
    "                                The licenses granted in this Section 2 are the only rights granted under\n" +
    "                                this License. No additional rights or licenses will be implied from the\n" +
    "                                distribution or licensing of Covered Software under this License.\n" +
    "                                Notwithstanding Section 2.1(b) above, no patent license is granted by a\n" +
    "                                Contributor:\n" +
    "\n" +
    "                                (a) for any code that a Contributor has removed from Covered Software;\n" +
    "                                    or\n" +
    "\n" +
    "                                (b) for infringements caused by: (i) Your and any other third party's\n" +
    "                                    modifications of Covered Software, or (ii) the combination of its\n" +
    "                                    Contributions with other software (except as part of its Contributor\n" +
    "                                    Version); or\n" +
    "\n" +
    "                                (c) under Patent Claims infringed by Covered Software in the absence of\n" +
    "                                    its Contributions.\n" +
    "\n" +
    "                                This License does not grant any rights in the trademarks, service marks,\n" +
    "                                or logos of any Contributor (except as may be necessary to comply with\n" +
    "                                the notice requirements in Section 3.4).\n" +
    "\n" +
    "                                2.4. Subsequent Licenses\n" +
    "\n" +
    "                                No Contributor makes additional grants as a result of Your choice to\n" +
    "                                distribute the Covered Software under a subsequent version of this\n" +
    "                                License (see Section 10.2) or under the terms of a Secondary License (if\n" +
    "                                permitted under the terms of Section 3.3).\n" +
    "\n" +
    "                                2.5. Representation\n" +
    "\n" +
    "                                Each Contributor represents that the Contributor believes its\n" +
    "                                Contributions are its original creation(s) or it has sufficient rights\n" +
    "                                to grant the rights to its Contributions conveyed by this License.\n" +
    "\n" +
    "                                2.6. Fair Use\n" +
    "\n" +
    "                                This License is not intended to limit any rights You have under\n" +
    "                                applicable copyright doctrines of fair use, fair dealing, or other\n" +
    "                                equivalents.\n" +
    "\n" +
    "                                2.7. Conditions\n" +
    "\n" +
    "                                Sections 3.1, 3.2, 3.3, and 3.4 are conditions of the licenses granted\n" +
    "                                in Section 2.1.\n" +
    "\n" +
    "                                3. Responsibilities\n" +
    "                                -------------------\n" +
    "\n" +
    "                                3.1. Distribution of Source Form\n" +
    "\n" +
    "                                All distribution of Covered Software in Source Code Form, including any\n" +
    "                                Modifications that You create or to which You contribute, must be under\n" +
    "                                the terms of this License. You must inform recipients that the Source\n" +
    "                                Code Form of the Covered Software is governed by the terms of this\n" +
    "                                License, and how they can obtain a copy of this License. You may not\n" +
    "                                attempt to alter or restrict the recipients' rights in the Source Code\n" +
    "                                Form.\n" +
    "\n" +
    "                                3.2. Distribution of Executable Form\n" +
    "\n" +
    "                                If You distribute Covered Software in Executable Form then:\n" +
    "\n" +
    "                                (a) such Covered Software must also be made available in Source Code\n" +
    "                                    Form, as described in Section 3.1, and You must inform recipients of\n" +
    "                                    the Executable Form how they can obtain a copy of such Source Code\n" +
    "                                    Form by reasonable means in a timely manner, at a charge no more\n" +
    "                                    than the cost of distribution to the recipient; and\n" +
    "\n" +
    "                                (b) You may distribute such Executable Form under the terms of this\n" +
    "                                    License, or sublicense it under different terms, provided that the\n" +
    "                                    license for the Executable Form does not attempt to limit or alter\n" +
    "                                    the recipients' rights in the Source Code Form under this License.\n" +
    "\n" +
    "                                3.3. Distribution of a Larger Work\n" +
    "\n" +
    "                                You may create and distribute a Larger Work under terms of Your choice,\n" +
    "                                provided that You also comply with the requirements of this License for\n" +
    "                                the Covered Software. If the Larger Work is a combination of Covered\n" +
    "                                Software with a work governed by one or more Secondary Licenses, and the\n" +
    "                                Covered Software is not Incompatible With Secondary Licenses, this\n" +
    "                                License permits You to additionally distribute such Covered Software\n" +
    "                                under the terms of such Secondary License(s), so that the recipient of\n" +
    "                                the Larger Work may, at their option, further distribute the Covered\n" +
    "                                Software under the terms of either this License or such Secondary\n" +
    "                                License(s).\n" +
    "\n" +
    "                                3.4. Notices\n" +
    "\n" +
    "                                You may not remove or alter the substance of any license notices\n" +
    "                                (including copyright notices, patent notices, disclaimers of warranty,\n" +
    "                                or limitations of liability) contained within the Source Code Form of\n" +
    "                                the Covered Software, except that You may alter any license notices to\n" +
    "                                the extent required to remedy known factual inaccuracies.\n" +
    "\n" +
    "                                3.5. Application of Additional Terms\n" +
    "\n" +
    "                                You may choose to offer, and to charge a fee for, warranty, support,\n" +
    "                                indemnity or liability obligations to one or more recipients of Covered\n" +
    "                                Software. However, You may do so only on Your own behalf, and not on\n" +
    "                                behalf of any Contributor. You must make it absolutely clear that any\n" +
    "                                such warranty, support, indemnity, or liability obligation is offered by\n" +
    "                                You alone, and You hereby agree to indemnify every Contributor for any\n" +
    "                                liability incurred by such Contributor as a result of warranty, support,\n" +
    "                                indemnity or liability terms You offer. You may include additional\n" +
    "                                disclaimers of warranty and limitations of liability specific to any\n" +
    "                                jurisdiction.\n" +
    "\n" +
    "                                4. Inability to Comply Due to Statute or Regulation\n" +
    "                                ---------------------------------------------------\n" +
    "\n" +
    "                                If it is impossible for You to comply with any of the terms of this\n" +
    "                                License with respect to some or all of the Covered Software due to\n" +
    "                                statute, judicial order, or regulation then You must: (a) comply with\n" +
    "                                the terms of this License to the maximum extent possible; and (b)\n" +
    "                                describe the limitations and the code they affect. Such description must\n" +
    "                                be placed in a text file included with all distributions of the Covered\n" +
    "                                Software under this License. Except to the extent prohibited by statute\n" +
    "                                or regulation, such description must be sufficiently detailed for a\n" +
    "                                recipient of ordinary skill to be able to understand it.\n" +
    "\n" +
    "                                5. Termination\n" +
    "                                --------------\n" +
    "\n" +
    "                                5.1. The rights granted under this License will terminate automatically\n" +
    "                                if You fail to comply with any of its terms. However, if You become\n" +
    "                                compliant, then the rights granted under this License from a particular\n" +
    "                                Contributor are reinstated (a) provisionally, unless and until such\n" +
    "                                Contributor explicitly and finally terminates Your grants, and (b) on an\n" +
    "                                ongoing basis, if such Contributor fails to notify You of the\n" +
    "                                non-compliance by some reasonable means prior to 60 days after You have\n" +
    "                                come back into compliance. Moreover, Your grants from a particular\n" +
    "                                Contributor are reinstated on an ongoing basis if such Contributor\n" +
    "                                notifies You of the non-compliance by some reasonable means, this is the\n" +
    "                                first time You have received notice of non-compliance with this License\n" +
    "                                from such Contributor, and You become compliant prior to 30 days after\n" +
    "                                Your receipt of the notice.\n" +
    "\n" +
    "                                5.2. If You initiate litigation against any entity by asserting a patent\n" +
    "                                infringement claim (excluding declaratory judgment actions,\n" +
    "                                counter-claims, and cross-claims) alleging that a Contributor Version\n" +
    "                                directly or indirectly infringes any patent, then the rights granted to\n" +
    "                                You by any and all Contributors for the Covered Software under Section\n" +
    "                                2.1 of this License shall terminate.\n" +
    "\n" +
    "                                5.3. In the event of termination under Sections 5.1 or 5.2 above, all\n" +
    "                                end user license agreements (excluding distributors and resellers) which\n" +
    "                                have been validly granted by You or Your distributors under this License\n" +
    "                                prior to termination shall survive termination.\n" +
    "\n" +
    "                                ************************************************************************\n" +
    "                                *                                                                      *\n" +
    "                                *  6. Disclaimer of Warranty                                           *\n" +
    "                                *  -------------------------                                           *\n" +
    "                                *                                                                      *\n" +
    "                                *  Covered Software is provided under this License on an \"as is\"       *\n" +
    "                                *  basis, without warranty of any kind, either expressed, implied, or  *\n" +
    "                                *  statutory, including, without limitation, warranties that the       *\n" +
    "                                *  Covered Software is free of defects, merchantable, fit for a        *\n" +
    "                                *  particular purpose or non-infringing. The entire risk as to the     *\n" +
    "                                *  quality and performance of the Covered Software is with You.        *\n" +
    "                                *  Should any Covered Software prove defective in any respect, You     *\n" +
    "                                *  (not any Contributor) assume the cost of any necessary servicing,   *\n" +
    "                                *  repair, or correction. This disclaimer of warranty constitutes an   *\n" +
    "                                *  essential part of this License. No use of any Covered Software is   *\n" +
    "                                *  authorized under this License except under this disclaimer.         *\n" +
    "                                *                                                                      *\n" +
    "                                ************************************************************************\n" +
    "\n" +
    "                                ************************************************************************\n" +
    "                                *                                                                      *\n" +
    "                                *  7. Limitation of Liability                                          *\n" +
    "                                *  --------------------------                                          *\n" +
    "                                *                                                                      *\n" +
    "                                *  Under no circumstances and under no legal theory, whether tort      *\n" +
    "                                *  (including negligence), contract, or otherwise, shall any           *\n" +
    "                                *  Contributor, or anyone who distributes Covered Software as          *\n" +
    "                                *  permitted above, be liable to You for any direct, indirect,         *\n" +
    "                                *  special, incidental, or consequential damages of any character      *\n" +
    "                                *  including, without limitation, damages for lost profits, loss of    *\n" +
    "                                *  goodwill, work stoppage, computer failure or malfunction, or any    *\n" +
    "                                *  and all other commercial damages or losses, even if such party      *\n" +
    "                                *  shall have been informed of the possibility of such damages. This   *\n" +
    "                                *  limitation of liability shall not apply to liability for death or   *\n" +
    "                                *  personal injury resulting from such party's negligence to the       *\n" +
    "                                *  extent applicable law prohibits such limitation. Some               *\n" +
    "                                *  jurisdictions do not allow the exclusion or limitation of           *\n" +
    "                                *  incidental or consequential damages, so this exclusion and          *\n" +
    "                                *  limitation may not apply to You.                                    *\n" +
    "                                *                                                                      *\n" +
    "                                ************************************************************************\n" +
    "\n" +
    "                                8. Litigation\n" +
    "                                -------------\n" +
    "\n" +
    "                                Any litigation relating to this License may be brought only in the\n" +
    "                                courts of a jurisdiction where the defendant maintains its principal\n" +
    "                                place of business and such litigation shall be governed by laws of that\n" +
    "                                jurisdiction, without reference to its conflict-of-law provisions.\n" +
    "                                Nothing in this Section shall prevent a party's ability to bring\n" +
    "                                cross-claims or counter-claims.\n" +
    "\n" +
    "                                9. Miscellaneous\n" +
    "                                ----------------\n" +
    "\n" +
    "                                This License represents the complete agreement concerning the subject\n" +
    "                                matter hereof. If any provision of this License is held to be\n" +
    "                                unenforceable, such provision shall be reformed only to the extent\n" +
    "                                necessary to make it enforceable. Any law or regulation which provides\n" +
    "                                that the language of a contract shall be construed against the drafter\n" +
    "                                shall not be used to construe this License against a Contributor.\n" +
    "\n" +
    "                                10. Versions of the License\n" +
    "                                ---------------------------\n" +
    "\n" +
    "                                10.1. New Versions\n" +
    "\n" +
    "                                Mozilla Foundation is the license steward. Except as provided in Section\n" +
    "                                10.3, no one other than the license steward has the right to modify or\n" +
    "                                publish new versions of this License. Each version will be given a\n" +
    "                                distinguishing version number.\n" +
    "\n" +
    "                                10.2. Effect of New Versions\n" +
    "\n" +
    "                                You may distribute the Covered Software under the terms of the version\n" +
    "                                of the License under which You originally received the Covered Software,\n" +
    "                                or under the terms of any subsequent version published by the license\n" +
    "                                steward.\n" +
    "\n" +
    "                                10.3. Modified Versions\n" +
    "\n" +
    "                                If you create software not governed by this License, and you want to\n" +
    "                                create a new license for such software, you may create and use a\n" +
    "                                modified version of this License if you rename the license and remove\n" +
    "                                any references to the name of the license steward (except to note that\n" +
    "                                such modified license differs from this License).\n" +
    "\n" +
    "                                10.4. Distributing Source Code Form that is Incompatible With Secondary\n" +
    "                                Licenses\n" +
    "\n" +
    "                                If You choose to distribute Source Code Form that is Incompatible With\n" +
    "                                Secondary Licenses under the terms of this version of the License, the\n" +
    "                                notice described in Exhibit B of this License must be attached.\n" +
    "\n" +
    "                                Exhibit A - Source Code Form License Notice\n" +
    "                                -------------------------------------------\n" +
    "\n" +
    "                                  This Source Code Form is subject to the terms of the Mozilla Public\n" +
    "                                  License, v. 2.0. If a copy of the MPL was not distributed with this\n" +
    "                                  file, You can obtain one at http://mozilla.org/MPL/2.0/.\n" +
    "\n" +
    "                                If it is not possible or desirable to put the notice in a particular\n" +
    "                                file, then You may include the notice in a location (such as a LICENSE\n" +
    "                                file in a relevant directory) where a recipient would be likely to look\n" +
    "                                for such a notice.\n" +
    "\n" +
    "                                You may add additional accurate notices of copyright ownership.\n" +
    "\n" +
    "                                Exhibit B - \"Incompatible With Secondary Licenses\" Notice\n" +
    "                                ---------------------------------------------------------\n" +
    "\n" +
    "                                  This Source Code Form is \"Incompatible With Secondary Licenses\", as\n" +
    "                                  defined by the Mozilla Public License, v. 2.0.\n" +
    "                                ======================================================================\n" +
    "\n" +
    "                                         License Mixing with apps, libcurl and Third Party Libraries\n" +
    "                                         ===========================================================\n" +
    "\n" +
    "                                libcurl can be built to use a fair amount of various third party libraries,\n" +
    "                                libraries that are written and provided by other parties that are distributed\n" +
    "                                using their own licenses. Even libcurl itself contains code that may cause\n" +
    "                                problems to some. This document attempts to describe what licenses libcurl and\n" +
    "                                the other libraries use and what possible dilemmas linking and mixing them all\n" +
    "                                can lead to for end users.\n" +
    "\n" +
    "                                I am not a lawyer and this is not legal advice!\n" +
    "\n" +
    "                                One common dilemma is that GPL[1]-licensed code is not allowed to be linked\n" +
    "                                with code licensed under the Original BSD license (with the announcement\n" +
    "                                clause). You may still build your own copies that use them all, but\n" +
    "                                distributing them as binaries would be to violate the GPL license - unless you\n" +
    "                                accompany your license with an exception[2]. This particular problem was\n" +
    "                                addressed when the Modified BSD license was created, which does not have the\n" +
    "                                announcement clause that collides with GPL.\n" +
    "\n" +
    "                                libcurl http://curl.haxx.se/docs/copyright.html\n" +
    "\n" +
    "                                        Uses an MIT (or Modified BSD)-style license that is as liberal as\n" +
    "                                        possible.  Some of the source files that deal with KRB4 have Original\n" +
    "                                        BSD-style announce-clause licenses. You may not distribute binaries\n" +
    "                                        with krb4-enabled libcurl that also link with GPL-licensed code!\n" +
    "\n" +
    "                                OpenSSL http://www.openssl.org/source/license.html\n" +
    "\n" +
    "                                        (May be used for SSL/TLS support) Uses an Original BSD-style license\n" +
    "                                        with an announcement clause that makes it \"incompatible\" with GPL. You\n" +
    "                                        are not allowed to ship binaries that link with OpenSSL that includes\n" +
    "                                        GPL code (unless that specific GPL code includes an exception for\n" +
    "                                        OpenSSL - a habit that is growing more and more common). If OpenSSL's\n" +
    "                                        licensing is a problem for you, consider using GnuTLS or yassl\n" +
    "                                        instead.\n" +
    "\n" +
    "                                GnuTLS  http://www.gnutls.org/\n" +
    "\n" +
    "                                        (May be used for SSL/TLS support) Uses the LGPL[3] license. If this is\n" +
    "                                        a problem for you, consider using OpenSSL instead. Also note that\n" +
    "                                        GnuTLS itself depends on and uses other libs (libgcrypt and\n" +
    "                                        libgpg-error) and they too are LGPL- or GPL-licensed.\n" +
    "\n" +
    "                                yassl   http://www.yassl.com/\n" +
    "\n" +
    "                                        (May be used for SSL/TLS support) Uses the GPL[1] license. If this is\n" +
    "                                        a problem for you, consider using OpenSSL or GnuTLS instead.\n" +
    "\n" +
    "                                NSS     http://www.mozilla.org/projects/security/pki/nss/\n" +
    "\n" +
    "                                        (May be used for SSL/TLS support) Is covered by the MPL[4] license,\n" +
    "                                        the GPL[1] license and the LGPL[3] license. You may choose to license\n" +
    "                                        the code under MPL terms, GPL terms, or LGPL terms. These licenses\n" +
    "                                        grant you different permissions and impose different obligations. You\n" +
    "                                        should select the license that best meets your needs.\n" +
    "\n" +
    "                                axTLS   http://axtls.sourceforge.net/\n" +
    "\n" +
    "                                        (May be used for SSL/TLS support) Uses a Modified BSD-style license.\n" +
    "\n" +
    "                                c-ares  http://daniel.haxx.se/projects/c-ares/license.html\n" +
    "\n" +
    "                                        (Used for asynchronous name resolves) Uses an MIT license that is very\n" +
    "                                        liberal and imposes no restrictions on any other library or part you\n" +
    "                                        may link with.\n" +
    "\n" +
    "                                zlib    http://www.gzip.org/zlib/zlib_license.html\n" +
    "\n" +
    "                                        (Used for compressed Transfer-Encoding support) Uses an MIT-style\n" +
    "                                        license that shouldn't collide with any other library.\n" +
    "\n" +
    "                                krb4\n" +
    "\n" +
    "                                        While nothing in particular says that a Kerberos4 library must use any\n" +
    "                                        particular license, the one I've tried and used successfully so far\n" +
    "                                        (kth-krb4) is partly Original BSD-licensed with the announcement\n" +
    "                                        clause. Some of the code in libcurl that is written to deal with\n" +
    "                                        Kerberos4 is Modified BSD-licensed.\n" +
    "\n" +
    "                                MIT Kerberos http://web.mit.edu/kerberos/www/dist/\n" +
    "\n" +
    "                                        (May be used for GSS support) MIT licensed, that shouldn't collide\n" +
    "                                        with any other parts.\n" +
    "\n" +
    "                                Heimdal http://www.pdc.kth.se/heimdal/\n" +
    "\n" +
    "                                        (May be used for GSS support) Heimdal is Original BSD licensed with\n" +
    "                                        the announcement clause.\n" +
    "\n" +
    "                                GNU GSS http://www.gnu.org/software/gss/\n" +
    "\n" +
    "                                        (May be used for GSS support) GNU GSS is GPL licensed. Note that you\n" +
    "                                        may not distribute binary curl packages that uses this if you build\n" +
    "                                        curl to also link and use any Original BSD licensed libraries!\n" +
    "\n" +
    "                                fbopenssl\n" +
    "\n" +
    "                                        (Used for SPNEGO support) Unclear license. Based on its name, I assume\n" +
    "                                        that it uses the OpenSSL license and thus shares the same issues as\n" +
    "                                        described for OpenSSL above.\n" +
    "\n" +
    "                                libidn  http://josefsson.org/libidn/\n" +
    "\n" +
    "                                        (Used for IDNA support) Uses the GNU Lesser General Public\n" +
    "                                        License [3]. LGPL is a variation of GPL with slightly less aggressive\n" +
    "                                        \"copyleft\". This license requires more requirements to be met when\n" +
    "                                        distributing binaries, see the license for details. Also note that if\n" +
    "                                        you distribute a binary that includes this library, you must also\n" +
    "                                        include the full LGPL license text. Please properly point out what\n" +
    "                                        parts of the distributed package that the license addresses.\n" +
    "\n" +
    "                                OpenLDAP http://www.openldap.org/software/release/license.html\n" +
    "\n" +
    "                                        (Used for LDAP support) Uses a Modified BSD-style license. Since\n" +
    "                                        libcurl uses OpenLDAP as a shared library only, I have not heard of\n" +
    "                                        anyone that ships OpenLDAP linked with libcurl in an app.\n" +
    "\n" +
    "                                libssh2 http://www.libssh2.org/\n" +
    "\n" +
    "                                        (Used for scp and sftp support) libssh2 uses a Modified BSD-style\n" +
    "                                        license.\n" +
    "\n" +
    "                                [1] = GPL - GNU General Public License: http://www.gnu.org/licenses/gpl.html\n" +
    "                                [2] = http://www.fsf.org/licenses/gpl-faq.html#GPLIncompatibleLibs details on\n" +
    "                                      how to write such an exception to the GPL\n" +
    "                                [3] = LGPL - GNU Lesser General Public License:\n" +
    "                                      http://www.gnu.org/licenses/lgpl.html\n" +
    "                                [4] = MPL - Mozilla Public License:\n" +
    "                                      http://www.mozilla.org/MPL/\n" +
    "\n" +
    "                                ======================================================================\n" +
    "\n" +
    "                                  LICENSE ISSUES\n" +
    "                                  ==============\n" +
    "\n" +
    "                                  The OpenSSL toolkit stays under a dual license, i.e. both the conditions of\n" +
    "                                  the OpenSSL License and the original SSLeay license apply to the toolkit.\n" +
    "                                  See below for the actual license texts. Actually both licenses are BSD-style\n" +
    "                                  Open Source licenses. In case of any license issues related to OpenSSL\n" +
    "                                  please contact openssl-core@openssl.org.\n" +
    "\n" +
    "                                  OpenSSL License\n" +
    "                                  ---------------\n" +
    "\n" +
    "                                ====================================================================\n" +
    "                                Copyright (c) 1998-2011 The OpenSSL Project.  All rights reserved.\n" +
    "\n" +
    "                                Redistribution and use in source and binary forms, with or without\n" +
    "                                modification, are permitted provided that the following conditions\n" +
    "                                are met:\n" +
    "\n" +
    "                                1. Redistributions of source code must retain the above copyright\n" +
    "                                   notice, this list of conditions and the following disclaimer.\n" +
    "\n" +
    "                                2. Redistributions in binary form must reproduce the above copyright\n" +
    "                                   notice, this list of conditions and the following disclaimer in\n" +
    "                                   the documentation and/or other materials provided with the\n" +
    "                                   distribution.\n" +
    "\n" +
    "                                3. All advertising materials mentioning features or use of this\n" +
    "                                   software must display the following acknowledgment:\n" +
    "                                   \"This product includes software developed by the OpenSSL Project\n" +
    "                                   for use in the OpenSSL Toolkit. (http://www.openssl.org/)\"\n" +
    "\n" +
    "                                4. The names \"OpenSSL Toolkit\" and \"OpenSSL Project\" must not be used to\n" +
    "                                   endorse or promote products derived from this software without\n" +
    "                                   prior written permission. For written permission, please contact\n" +
    "                                   openssl-core@openssl.org.\n" +
    "\n" +
    "                                5. Products derived from this software may not be called \"OpenSSL\"\n" +
    "                                   nor may \"OpenSSL\" appear in their names without prior written\n" +
    "                                   permission of the OpenSSL Project.\n" +
    "\n" +
    "                                6. Redistributions of any form whatsoever must retain the following\n" +
    "                                   acknowledgment:\n" +
    "                                   \"This product includes software developed by the OpenSSL Project\n" +
    "                                   for use in the OpenSSL Toolkit (http://www.openssl.org/)\"\n" +
    "\n" +
    "                                THIS SOFTWARE IS PROVIDED BY THE OpenSSL PROJECT ``AS IS'' AND ANY\n" +
    "                                EXPRESSED OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE\n" +
    "                                IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR\n" +
    "                                PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE OpenSSL PROJECT OR\n" +
    "                                ITS CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,\n" +
    "                                SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT\n" +
    "                                NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;\n" +
    "                                LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)\n" +
    "                                HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,\n" +
    "                                STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)\n" +
    "                                ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED\n" +
    "                                OF THE POSSIBILITY OF SUCH DAMAGE.\n" +
    "                                ====================================================================\n" +
    "\n" +
    "                                This product includes cryptographic software written by Eric Young\n" +
    "                                (eay@cryptsoft.com).  This product includes software written by Tim\n" +
    "                                Hudson (tjh@cryptsoft.com).\n" +
    "\n" +
    "\n" +
    "\n" +
    "                                 Original SSLeay License\n" +
    "                                 -----------------------\n" +
    "                                Copyright (C) 1995-1998 Eric Young (eay@cryptsoft.com)\n" +
    "                                All rights reserved.\n" +
    "\n" +
    "                                This package is an SSL implementation written\n" +
    "                                by Eric Young (eay@cryptsoft.com).\n" +
    "                                The implementation was written so as to conform with Netscapes SSL.\n" +
    "\n" +
    "                                This library is free for commercial and non-commercial use as long as\n" +
    "                                the following conditions are aheared to.  The following conditions\n" +
    "                                apply to all code found in this distribution, be it the RC4, RSA,\n" +
    "                                lhash, DES, etc., code; not just the SSL code.  The SSL documentation\n" +
    "                                included with this distribution is covered by the same copyright terms\n" +
    "                                except that the holder is Tim Hudson (tjh@cryptsoft.com).\n" +
    "\n" +
    "                                Copyright remains Eric Young's, and as such any Copyright notices in\n" +
    "                                the code are not to be removed.\n" +
    "                                If this package is used in a product, Eric Young should be given attribution\n" +
    "                                as the author of the parts of the library used.\n" +
    "                                This can be in the form of a textual message at program startup or\n" +
    "                                in documentation (online or textual) provided with the package.\n" +
    "\n" +
    "                                Redistribution and use in source and binary forms, with or without\n" +
    "                                modification, are permitted provided that the following conditions\n" +
    "                                are met:\n" +
    "                                1. Redistributions of source code must retain the copyright\n" +
    "                                   notice, this list of conditions and the following disclaimer.\n" +
    "                                2. Redistributions in binary form must reproduce the above copyright\n" +
    "                                   notice, this list of conditions and the following disclaimer in the\n" +
    "                                   documentation and/or other materials provided with the distribution.\n" +
    "                                3. All advertising materials mentioning features or use of this software\n" +
    "                                   must display the following acknowledgement:\n" +
    "                                   \"This product includes cryptographic software written by\n" +
    "                                    Eric Young (eay@cryptsoft.com)\"\n" +
    "                                   The word 'cryptographic' can be left out if the rouines from the library\n" +
    "                                   being used are not cryptographic related :-).\n" +
    "                                4. If you include any Windows specific code (or a derivative thereof) from\n" +
    "                                   the apps directory (application code) you must include an acknowledgement:\n" +
    "                                   \"This product includes software written by Tim Hudson (tjh@cryptsoft.com)\"\n" +
    "\n" +
    "                                THIS SOFTWARE IS PROVIDED BY ERIC YOUNG ``AS IS'' AND\n" +
    "                                ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE\n" +
    "                                IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE\n" +
    "                                ARE DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR OR CONTRIBUTORS BE LIABLE\n" +
    "                                FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL\n" +
    "                                DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS\n" +
    "                                OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)\n" +
    "                                HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT\n" +
    "                                LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY\n" +
    "                                OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF\n" +
    "                                SUCH DAMAGE.\n" +
    "\n" +
    "                                The licence and distribution terms for any publically available version or\n" +
    "                                derivative of this code cannot be changed.  i.e. this code cannot simply be\n" +
    "                                copied and put under another distribution licence\n" +
    "                                [including the GNU Public Licence.]\n" +
    "\n" +
    "                                ======================================================================\n" +
    "\n" +
    "                                (C) 1995-2017 Jean-loup Gailly and Mark Adler\n" +
    "\n" +
    "                                 This software is provided 'as-is', without any express or implied\n" +
    "                                 warranty.  In no event will the authors be held liable for any damages\n" +
    "                                 arising from the use of this software.\n" +
    "\n" +
    "                                 Permission is granted to anyone to use this software for any purpose,\n" +
    "                                 including commercial applications, and to alter it and redistribute it\n" +
    "                                 freely, subject to the following restrictions:\n" +
    "\n" +
    "                                 1. The origin of this software must not be misrepresented; you must not\n" +
    "                                    claim that you wrote the original software. If you use this software\n" +
    "                                    in a product, an acknowledgment in the product documentation would be\n" +
    "                                    appreciated but is not required.\n" +
    "                                 2. Altered source versions must be plainly marked as such, and must not be\n" +
    "                                    misrepresented as being the original software.\n" +
    "                                 3. This notice may not be removed or altered from any source distribution.\n" +
    "\n" +
    "                                 Jean-loup Gailly        Mark Adler\n" +
    "                                 jloup@gzip.org          madler@alumni.caltech.edu\n" +
    "\n" +
    "                               If you use the zlib library in a product, we would appreciate *not* receiving\n" +
    "                               lengthy legal documents to sign.  The sources are provided for free but without\n" +
    "                               warranty of any kind.  The library has been entirely written by Jean-loup\n" +
    "                               Gailly and Mark Adler; it does not include third-party code.\n" +
    "\n" +
    "                               If you redistribute modified sources, we would appreciate that you include in\n" +
    "                               the file ChangeLog history information documenting your changes.  Please read\n" +
    "                               the FAQ for more information on the distribution of modified source versions.\n" +
    "\n";

