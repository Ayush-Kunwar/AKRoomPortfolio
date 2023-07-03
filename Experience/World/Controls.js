import * as THREE from "three";
import Experience from "../Experience.js";
import GSAP from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";
import ASScroll from "@ashthornton/asscroll";

export default class Controls {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.sizes = this.experience.sizes;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.camera = this.experience.camera;
        this.room = this.experience.world.room.actualRoom;
        this.room.children.forEach((child) => {
            if (child.type === "RectAreaLight") {
                this.rectLight = child;
            }
        });
        this.circleFirst = this.experience.world.floor.circleFirst;
        this.circleSecond = this.experience.world.floor.circleSecond;
        this.circleThird = this.experience.world.floor.circleThird;

        GSAP.registerPlugin(ScrollTrigger);

        document.querySelector(".page").style.overflow = "visible";

        if (
            !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            )
        ) {
            this.setSmoothScroll();
        }
        this.setScrollTrigger();
    }

    setupASScroll() {
        // https://github.com/ashthornton/asscroll
        const asscroll = new ASScroll({
            ease: 0.1,
            disableRaf: true,
        });

        GSAP.ticker.add(asscroll.update);

        ScrollTrigger.defaults({
            scroller: asscroll.containerElement,
        });

        ScrollTrigger.scrollerProxy(asscroll.containerElement, {
            scrollTop(value) {
                if (arguments.length) {
                    asscroll.currentPos = value;
                    return;
                }
                return asscroll.currentPos;
            },
            getBoundingClientRect() {
                return {
                    top: 0,
                    left: 0,
                    width: window.innerWidth,
                    height: window.innerHeight,
                };
            },
            fixedMarkers: true,
        });

        asscroll.on("update", ScrollTrigger.update);
        ScrollTrigger.addEventListener("refresh", asscroll.resize);

        requestAnimationFrame(() => {
            asscroll.enable({
                newScrollElements: document.querySelectorAll(
                    ".gsap-marker-start, .gsap-marker-end, [asscroll]"
                ),
            });
        });
        return asscroll;
    }
    
    setSmoothScroll(){
       this.asscroll = this.setupASScroll();
    }


    setScrollTrigger() {
        let mm = GSAP.matchMedia();

        //desktop
        this.room.scale.set(0.11,0.11,0.11)
        this.rectLight.width = 0.5;
        this.rectLight.height = 1;
        mm.add("(min-width: 696px)", () => {
            // desktop setup code here...
            console.log("fired desktop")
            // First section
            this.firstMoveTimeline = new GSAP.timeline({
            scrollTrigger: {
                trigger: ".first-move",
                markers: true,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.6,
                invalidateOnRefresh: true,
            },
            });
            this.firstMoveTimeline.to(this.room.position, {
                x: () => {
                    return this.sizes.width * 0.003;
                },
            });
            // Second Section
            this.secondMoveTimeline = new GSAP.timeline({
                scrollTrigger: {
                    trigger: ".second-move",
                    markers: true,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 0.6,
                    invalidateOnRefresh: true,
                },
            })
                .to(
                    this.room.position, 
                    {
                        x: () => {
                            return 1;
                        },
                        z: () => {
                            return this.sizes.height * 0.003;
                        },
                },
                "same"
                )
                .to(
                    this.room.scale, 
                    {
                        x: 0.35,
                        y: 0.35,
                        z: 0.35,
                    },
                    "same"
                )

                .to(
                    this.rectLight, 
                    {
                        width: 0.5 * 3.5,
                        height: 3.5
                    },
                    "same"
                );
            // Third section
            this.thirdMoveTimeline = new GSAP.timeline({
                scrollTrigger: {
                    trigger: ".third-move",
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 0.6,
                    invalidateOnRefresh: true,
                },
                }).to(this.room.position, 
                    {
                        y: 6,
                        x: 9,
                    }, 
                    "same"
                )
        });

    



        mm.add("(max-width: 968px)", () => {
            console.log("fired mobile");
            //Resets SCale
            this.room.position.set(0, 0, 0)
            this.room.scale.set(0.07, 0.07, 0.07);
            // mobile setup code here...
            //First Section
            this.firstMoveTimeline = new GSAP.timeline({
                scrollTrigger: {
                    trigger: ".first-move",
                    markers: true,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 0.6,
                    invalidateOnRefresh: true,
                }
            }).to(this.room.scale,{
                x : 0.08,
                y : 0.08,
                z : 0.08
            }),
            //Second Section
            this.secondMoveTimeline = new GSAP.timeline({
                scrollTrigger: {
                    trigger: ".second-move",
                    markers: true,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 0.6,
                    invalidateOnRefresh: true,
                }
            }).to(this.room.scale,{
                x: 0.28,
                y: 0.28,
                z: 0.28,
            }, "same").to(this.room.position, {
                x: 5,
            }, "same"),
            //Third Section
            this.thirdMoveTimeline = new GSAP.timeline({
                scrollTrigger: {
                    trigger: ".third-move",
                    markers: true,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 0.6,
                    invalidateOnRefresh: true,
                }
            }).to(this.room.position, {
                z: -6,
            });
        });



    
    this.sections = document.querySelectorAll(".section");
    this.sections.forEach(section => {
        this.progressWrapper = section.querySelector(".progress-wrapper")
        this.progressBar = section.querySelector(".progress-bar")

        if(section.classList.contains("right")){
            GSAP.to(section, {
                borderTopLeftRadius: 10,
                scrollTrigger: {
                    trigger: section,
                    start: "top bottom",
                    end: "top top",
                    markers: true,
                    scrub: 0.6,
                },
            });
            GSAP.to(section, {
                borderBottomLeftRadius: 700,
                scrollTrigger: {
                    trigger: section,
                    start: "bottom bottom",
                    end: "bottom top",
                    markers: true,
                    scrub: 0.6,
                },
            });
        }else{
            GSAP.to(section, {
                borderTopRightRadius: 10,
                scrollTrigger: {
                    trigger: section,
                    start: "top bottom",
                    end: "top top",
                    markers: true,
                    scrub: 0.6,
                },
            });
            GSAP.to(section, {
                borderBottomRightRadius: 700,
                scrollTrigger: {
                    trigger: section,
                    start: "bottom bottom",
                    end: "bottom top",
                    markers: true,
                    scrub: 0.6,
                },
            });
        }
        GSAP.from(this.progressBar, {
            scaleY: 0,
            scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.4,
            pin: this.progressWrapper,
            pinSpacing: false
            }
        })
    });

    //Circle Animations
    this.firstCircle = new GSAP.timeline({
        scrollTrigger: {
            trigger: ".first-move",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
        },
    }).to(this.circleFirst.scale, {
        x: 3,
        y: 3,
        z: 3,
    });

    // Second section -----------------------------------------
    this.secondCircle = new GSAP.timeline({
        scrollTrigger: {
            trigger: ".second-move",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
        },
    })
        .to(
            this.circleSecond.scale,
            {
                x: 3,
                y: 3,
                z: 3,
            },
            "same"
        )
        .to(
            this.room.position,
            {
                y: 1,
            },
            "same"
        );

    // Third section -----------------------------------------
    this.thirdCircle = new GSAP.timeline({
        scrollTrigger: {
            trigger: ".third-move",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
        },
    }).to(this.circleThird.scale, {
        x: 3,
        y: 3,
        z: 3,
    })



    //Mini Floor Animation
    this.secondPartTimeline = new GSAP.timeline({
        scrollTrigger: {
            trigger: ".third-move",
            markers: true,
            start: "center center",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
        }
    })
    console.log(this.room.children)
    this.room.children.forEach((child) => {
        if (child.name === "Mini_Floor") {
            this.first = GSAP.to(child.position, {
                x: -16.1789,
                z: 31.8579,
                y: 1,
                duration: 0.6,
            });
        }
        if (child.name === "Fountain") {
            this.seventh = GSAP.to(child.scale, {
                x: 1,
                z: 1,
                y: 1,
                ease: "back.out(2)",
                duration: 0.6,
            });
        }
        if (child.name === "Lamp") {
            this.eighth = GSAP.to(child.scale, {
                x: 1,
                z: 1,
                y: 1,
                ease: "back.out(2)",
                duration: 0.6,
            });
        }
        if (child.name === "Flower1") {
            this.ninth = GSAP.to(child.scale, {
                x: 1,
                z: 1,
                y: 1,
                ease: "back.out(2)",
                duration: 0.6,
            });
        }
        if (child.name === "Flower2") {
            this.fifth = GSAP.to(child.scale, {
                x: 1,
                z: 1,
                y: 1,
                ease: "back.out(2)",
                duration: 0.6,
            });
        }
        if (child.name === "Flower3") {
            this.sixth = GSAP.to(child.scale, {
                x: 1,
                z: 1,
                y: 1,
                ease: "back.out(2)",
                duration: 0.6,
            });
        }
        if (child.name === "Fountain_Floor") {
            this.fourth = GSAP.to(child.scale, {
                x: 1,
                z: 1,
                y: 1,
                duration: 0.6,
            });
        }
        if (child.name === "Lamp_Floor") {
            this.second = GSAP.to(child.scale, {
                x: 1,
                z: 1,
                y: 1,
                ease: "back.out(2)",
                duration: 0.6,
            });
        }
        if (child.name === "Dirt") {
            this.third = GSAP.to(child.scale, {
                x: 1,
                z: 1,
                y: 1,
                ease: "back.out(2)",
                duration: 0.6,
            });
        }
    })

    this.secondPartTimeline.add(this.first)
    this.secondPartTimeline.add(this.second)
    this.secondPartTimeline.add(this.third)
    this.secondPartTimeline.add(this.fourth)
    this.secondPartTimeline.add(this.fifth)
    this.secondPartTimeline.add(this.sixth)
    this.secondPartTimeline.add(this.seventh)
    this.secondPartTimeline.add(this.eighth)
    this.secondPartTimeline.add(this.ninth)
    
}
//x: -16.1789 , 
//z: 31.8579,
//duration: 0.3
    resize() {}
    update() {
        //this.lerp.target = GSAP.utils.clamp(0, 1, this.lerp.target);
        //this.lerp.current = GSAP.utils.clamp(0, 1, this.lerp.current);
        //this.curve.getPointAt(this.lerp.current, this.position);
        //this.curve.getPointAt(this.lerp.current += 0.001, this.lookAtPosition);
        //this.camera.orthographicCamera.position.copy(this.position);
        //this.camera.orthographicCamera.lookAt(this.lookAtPosition)
    }
}