export const createSparkEffect = (): void => {
  const sparkContainer = document.createElement("div")
  sparkContainer.className = "spark-container"

  for (let i = 0; i < 40; i++) {
    const spark = document.createElement("span")

    spark.className = "spark"
    spark.style.left = `${Math.random() * 100}%`
    spark.style.animationDelay = `${Math.random() * 0.8}s`

    sparkContainer.append(spark)
  }

  document.body.append(sparkContainer)

  setTimeout(() => {
    sparkContainer.remove()
  }, 2500)
}

/*
RULES / TERMINOLOGY:
- Spark effect = visual win animation.
- Math.random = random spark position.
- setTimeout = removes sparks after animation.
*/